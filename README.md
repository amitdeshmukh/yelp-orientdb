# yelp-orientdb

Sample scripts to import the yelp academic/challenge datasets into orientdb for analysis. 

Check out <http://www.amitdeshmukh.co/import-yelp-dataset-orientdb-graph-database/> for an indepth post.

## Installation
Clone the repo: 

`git clone https://github.com/amitdeshmukh/yelp-orientdb.git`.

Change directory:  

`cd yelp-orientdb`

Install using npm: 

`npm install`

You will need to have [OrientDB](http://orientdb.com/) graph database installed.

You may also need to download the Yelp Dataset from here: <http://www.yelp.com/dataset_challenge>

- Import Yelp data for businesses:  

`node yelp-nodes.js business.json`

- Import Users

`node yelp-nodes.js users.json`

- Import Reviews

`node yelp-edges.js review.json`
