#!/bin/bash
curl --form "file=@$1" --form "username=clayton"\
  --form "password=petty" localhost:3000/clayton/receive
