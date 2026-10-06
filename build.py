#!/usr/bin/env python3
import argparse
import os.path
from pathlib import Path
import re
import shutil
import subprocess

# Usage
# python3 ./build.py [--gitrequired]

# if the gitrequired flag is used, the script will abort if it fails to get the current
# git commit


##
### Helper Functions
##

# build script is in the source root
PATH_SRC = os.path.dirname(os.path.realpath(__file__))

# return build path (useful for main build release script)
def output_path():
  return os.path.join(PATH_SRC, "_out")

# Function to get current commit hash without needing git executable or lib
# Modified version of: https://stackoverflow.com/a/68215738/7572076
def get_commit():
  git_folder = Path(os.path.join(PATH_SRC, '.git'))
  head_content = Path(git_folder, 'HEAD').read_text().split('\n')[0]
  commit_regex = re.compile(r"^[a-fA-F0-9]{40}$")

  # HEAD references another file in ref
  if head_content.startswith("ref: "):
    head_name = head_content.split(' ')[-1]
    head_ref = Path(git_folder,head_name)
    ref_file_content = head_ref.read_text().replace('\n','')

    if re.match(commit_regex, ref_file_content):
      return ref_file_content

  # HEAD has a commit in it (such as for a tag)
  if re.match(commit_regex, head_content):
    return head_content

  return ""

def get_frontend_version():
  version_pattern = re.compile(r"export const frontendVersion = '(\d+\.\d+\.\d+)';")

  with open(os.path.join(PATH_SRC, 'src', 'helpers', 'constants.ts')) as const_ts_file:
    for line in const_ts_file:
      match = re.search(version_pattern, line)
      if match != None:
        version_string = match.group(1)
        break

  if version_string == "":
    print("aborting: failed to parse version number")
    exit(-1)

  return version_string

##
#### Build Script
##

def build(git_required):
  # get version number
  version_string = get_frontend_version()

  # try to get hash
  git_head = get_commit()
  if git_head != "":
    version_string += "_(" + git_head[:7] + ")"
  else:
    print("failed to get git hash")
    if git_required:
      print("aborting: git hash is required by --gitrequired")
      exit(-1)

  print(f"preparing to build certwarden-frontend version '{version_string}'")
  
  # create out path
  path_output = output_path()
  if os.path.exists(path_output):
    print("certwarden-frontend build output directory already exists, removing it")
    shutil.rmtree(path_output)
  os.makedirs(path_output)

  # build
  print("building certwarden-frontend ...")

  # necessary because subprocess.run "npm" in PowerShell doesn't work properly
  npm_cmd = shutil.which("npm")

  # npm ci (commented to do elsewhere)
  # result = subprocess.run([npm_cmd, "ci"], cwd=PATH_SRC)
  # if result.returncode != 0:
  #   print(f"build certwarden-frontend npm ci failed")
  #   exit(-2)

  # build
  result = subprocess.run([npm_cmd, "run", "build"], cwd=PATH_SRC)
  if result.returncode != 0:
    print(f"build certwarden-frontend failed")
    exit(-2)

  # move dist to the appropriate output location
  shutil.move(os.path.join(PATH_SRC, "dist"), os.path.join(path_output, "frontend_build"))

  # write HEAD
  if git_head:
    with open(os.path.join(path_output, "HEAD-frontend"), "a") as f:
      f.write(git_head)

##
### Main Script
##
def main():
  print("initializing certwarden-frontend build script")

  # parse args
  parser = argparse.ArgumentParser()
  parser.add_argument('--gitrequired', action='store_true')
  args = parser.parse_args()

  # run build
  build(args.gitrequired)

  print("exiting certwarden-frontend build script")

# run main if this script is called directly
if __name__ == "__main__":
    main()
