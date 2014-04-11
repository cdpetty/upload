import sys

def log(statement):
  ##if not QUIET:
  sys.stdout.write(statement)
  sys.stdout.flush()

def die(statement):
  sys.stderr.write('ERROR: ' + statement + '\n')
  sys.exit(1)

def end(statement):
  log(statement + '\n')
  sys.exit(0)