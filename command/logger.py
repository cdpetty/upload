import sys

def log(*statements):
  ##if not QUIET:
  phrase = ' '.join(map(str, statements))
  sys.stdout.write(phrase)
  sys.stdout.flush()

def die(statement):
  sys.stderr.write('ERROR: ' + statement + '\n')
  sys.exit(1)

def end(statement):
  log(statement + '\n')
  sys.exit(0)