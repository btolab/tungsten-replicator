
# TUNGSTEN REPLICATOR

##1 INTRODUCTION

Tungsten Replicator is an open source replication engine supporting a variety of different extractor and applier modules. 
Data can be extracted from MySQL, Oracle and Amazon RDS, and applied to transactional stores.

Tungsten Replicator supports extraction from:

* MySQL 5.0-5.6, 5.7 (with limited datatype support)
* Amazon RDS for MySQL
+ Oracle 10g, 11g using CDC

Data can be applied to:

* MySQL
* Amazon RDS for MySQL
* Oracle
* MongoDB
* HPE Vertica
* Hadoop (HDFS/Hive)
* Amazon RedShift
* Apache Cassandra

During replication, Tungsten Replication assigns data a unique global transaction ID, and enables flexible statement 
and/or row-based replication of data. This enables data to be exchanged between different databases and different database 
versions. During replication, information can be filtered and modified, and deployment can be between on-premise or 
cloud-based databases. For performance, Tungsten Replicator includes support for parallel replication, and advanced 
topologies such as fan-in and multi-master, and can be used efficiently in cross-site deployments.

This repo tracks the Tungsten Replicator 5.0 series. 

## 2 LICENSING

This software is released under the Apache 2.0 license, a copy of which is located in the LICENSE file.  

##3 BUILDING

To build a replicator, follow the steps shown below to obtain the source and build. 

       git clone https://github.com/continuent/tungsten-replicator
       cd tungsten-replicator/builder
       ./build.sh

The output of a build is a tar.gz file in the builds directory. 

To build successfully you will require the following prerequisite software: 

* JDK 7 or higher
* Ant 1.8 or higher

##4 DOWNLOADS

Currently there are no builds from the new code available, they will be made available as soon as possible.

##5 DOCUMENTATION

Documentation for Tungsten Replicator is located [on the Continuent Documentation website](http://docs.continuent.com/tungsten-replicator-5.2-oss/index.html).

##6 INSTALLATION

To install the replicator follow the steps shown below. 

1. Review the installation instructions in the Tungsten Replicator Installation Guide.  

2. Run the 'tpm' command in the tools directory to configure and start
  Tungsten services for standard replication topologies. The manual
  has examples for many of them.

The Installation Guide provides additional information on installation
procedures. 

##7 DEVELOPMENT

Most of us use Eclipse for replicator.  Here's how to get started. 

1. Download Eclipse 4.5 (Mars) with Egit plugin for source management using Git. (It's default in most downloads)
2. Create a new Eclipse workspace in the main tungsten-replicator directory created by the 'git clone' command. 
3. Import the builder, commons, and replicator projects into the workspace. 

Eclipse code and comment formatting definitions are located in commons/eclipse-settings.  
See the README.txt for instructions on importing.  (And no, we don't plan on changing them to suit anyone's individual 
tastes.  It screws up merges and we have been using them for about a decade.)

##8 COMMUNITY

Tungsten Replicator is supported by an active community.  You can find us in the following places. 

* [Google Group discussion on Tungsten Replicator](http://groups.google.com/group/tungsten-replicator-discuss)
* Blogs, especially: [MCB Guru Blog](http://mcb.guru), [Continuent Blog](https://www.continuent.com/blog/)
* Older Blogs: [The Data Charmer](http://datacharmer.blogspot.com/), and [The Scale Out Blog](http://scale-out-blog.blogspot.com/), and 

##9 CONTRIBUTIONS

Active communities contribute code and we're happy to consider yours. To be involved, please email [MC Brown](mailto:mc.brown@continuent.com)

##10 PROBLEMS

This is open source software. Check the wiki, issues list, and mailing lists to get help.  
Continuent also offers commercial products based on Tungsten Replicator.  See the 
[Continuent](http://www.continuent.com/solutions) 
products page for more information. 

Copyright (C) 2015 VMware, Inc. -- Updated 13th October 2017

