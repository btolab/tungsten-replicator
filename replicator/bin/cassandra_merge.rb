#!/usr/bin/ruby

require 'cassandra'

begin
  client = Cassandra.cluster(connect_timeout: 15)
rescue => e
  puts "#{e.class.name}: #{e.message}"
end

# Input arguments are
# keyspace (schema)
# tablename (table)
# staging_tablename (staging_table)

keyspace = ARGV[0]
tablename = ARGV[1]
staging_tablename = ARGV[2]
stage_column_prefix = ARGV[3]
pkey_columns = ARGV[4]
pkeylist = pkey_columns.split(',')

if (pkeylist.length > 1)
  abort("Cannot currently handle table with multi-column keys")
end

if (keyspace.to_s.empty?) ||
   (tablename.to_s.empty?) ||
   (staging_tablename.to_s.empty?) ||
   (stage_column_prefix.to_s.empty?) ||
   (pkey_columns.to_s.empty?)
  abort("Need keyspace table staging_table stage_column_prefix pleycolumns")
end

session = client.connect(keyspace)

# Perform the deletes first

deleteids = Array.new()

future = session.execute_async("SELECT #{pkey_columns} FROM #{staging_tablename} where #{stage_column_prefix}opcode ='D' allow filtering")
future.on_success do |rows|
  rows.each do |row|
    deleteids.push(row[pkey_columns])
  end
end
future.join

deleteidlist = deleteids.join(",")

if (deleteidlist.length > 0)
  session.execute("delete from #{tablename} where #{pkey_columns} in (#{deleteidlist}) ");
end

updateids = Hash.new()
updatedata = Hash.new()

future = session.execute_async("SELECT * FROM #{staging_tablename} where #{stage_column_prefix}opcode ='I' ALLOW FILTERING") 
future.on_success do |rows|
  rows.each do |row|
    id = row["#{pkey_columns}"]
    if updateids[id]
      if updateids[id] < row["#{stage_column_prefix}seqno"]
        updateids[id] = row["#{stage_column_prefix}seqno"]
        updatedata[id] = row
      end
    else
      updatedata[id] = row
    end
  end
end
future.join

updatedata.each do |rowid,rowdata|
  rowdata.delete("#{stage_column_prefix}opcode")
  rowdata.delete("#{stage_column_prefix}seqno")
  rowdata.delete("#{stage_column_prefix}row_id")
  rowdata.delete("#{stage_column_prefix}commit_timestamp")
end  

updatedata.each do |rowid,rowdata|
  collist = rowdata.keys.join(',')
  colcount = rowdata.keys.length
  substbase = Array.new()
  #  (1..colcount).each {substbase.push('?')}
  rowdata.values.each do |value|
    if value.is_a?(String)
      substbase.push("$$" + value.to_s + "$$")
    elsif value.nil?
      substbase.push("NULL")
    else
      substbase.push(value)
    end
  end

  substlist = substbase.join(',')

  cqlinsert = "insert into #{tablename} ("+collist+") values ("+substlist+")"

  session.execute(cqlinsert)
end

cqldelete = "truncate #{staging_tablename}"

session.execute(cqldelete)
