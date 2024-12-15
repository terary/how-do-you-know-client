#!/bin/bash
#http://predicatetree.com/questionnaires/questions.json
# Push questions.json to remote server
scp -P 33233 questions.json predicatetree.com:/www/predicatetree.com/web/public_html/questionnaires/
