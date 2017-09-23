/**
 * Tungsten Replicator
 * Copyright (C) 2017 Continuent Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 *      
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Load script for Redshift through S3. Uses AWS credentials from
 * share/s3-config-{service}.json configuration file.
 *
 * @author <a href="mailto:mc.brown@continuent.com">MC Brown</a>
 */

/* Global Variables */

var schema;
var table;
var key;
var pkey_columns;
var base_columns;
var stage_columns;
var stagetableprefix;
var stagecolumnprefix;

/** Called once when applier goes online. */
function prepare()
{
    properties = runtime.getContext().getReplicatorProperties();
    stagecolumns = properties.getString('replicator.applier.dbms.stageColumnNames');
    stagecolumnprefix = properties.getString('replicator.applier.dbms.stageColumnPrefix');
    stagetableprefix = properties.getString('replicator.applier.dbms.stageTablePrefix');

    scolumnlist = stagecolumns.split(',');
    prefixscols = [];
    
    for(var i=0;i<scolumnlist.length;i++)
    {
	prefixscols.push(stagecolumnprefix + scolumnlist[i]);
    }

    stage_columns = prefixscols.join(',');
}

/** Called at start of batch transaction. */
function begin()
{

}

/** Called for each table in the transaction.  Load rows to staging table. */
function apply(csvinfo)
{
    // Fill in variables required to create SQL to merge data for current table.
    csv_file = csvinfo.file.getAbsolutePath();
    csv_filename = csvinfo.file.getName();
    csv_extension = "";
    gzip_option = "";
    schema = csvinfo.schema;
    table = csvinfo.table;
    seqno = csvinfo.startSeqno;
    key = csvinfo.key;
    stage_table_fqn = csvinfo.getStageTableFQN();
    base_table_fqn = csvinfo.getBaseTableFQN();
    base_columns = csvinfo.getBaseColumnList();
    pkey_columns = csvinfo.getPKColumnList();

    sql = 'cqlsh --keyspace=' + schema + ' --execute="' + 
        'copy ' + stagetableprefix + table + " (" + stage_columns + "," +
        base_columns + ") from '" + csv_file + "' with NULL='NULL';\"";

    logger.info(sql);

    runtime.exec(sql);

    // Commit the transaction.

    merge = "cassandra_merge.rb " +
	schema + " " + table + " " + stagetableprefix + table + " " +
	stagecolumnprefix + " " + pkey_columns;

    logger.info(merge);

    runtime.exec(merge);
}

/** Called at commit time for a batch. */
function commit()
{
}

/** Called when the applier goes offline. */
function release()
{
  // Does nothing.
}
