#!/usr/bin/env python3
import argparse
import os.path
from pathlib import Path
import re
import shutil
import subprocess
import tarfile

# Usage
# python3 ./build_release.py [--gitrequired]

# if the gitrequired flag is used, the script will abort if it fails to get the current
# git commit

# Assumptions:
# Frontend source is cloned into [root]/[src]/certwarden-frontend

##
### Helper Functions
##

# Function to get current commit hash without needing git executable or lib
# Modified version of: https://stackoverflow.com/a/68215738/7572076
def get_commit(src_path):
  git_folder = Path(os.path.join(src_path, '.git'))
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


##
### Main Script
##

print("initializing certwarden-frontend build script")

# define paths
path_src_frontend = os.path.dirname(os.path.realpath(__file__))
path_src = Path(__file__).parents[1]
path_root = Path(__file__).parents[2]

path_output = os.path.join(path_root, "_out", "frontend")

# parse args
parser = argparse.ArgumentParser()
parser.add_argument('--gitrequired', action='store_true')
args = parser.parse_args()

# get version number
versionString = ""
versionPattern = re.compile(r"export const frontendVersion = '(\d+\.\d+\.\d+)';")

with open(os.path.join(path_src_frontend, 'src', 'helpers', 'constants.ts')) as const_ts_file:
  for line in const_ts_file:
    match = re.search(versionPattern, line)
    if match != None:
      versionString = match.group(1)
      break

if versionString == "":
  print("aborting: failed to parse version number")
  exit(-1)

# try to get hash
gitHead = get_commit(path_src_frontend)
if gitHead != "":
  versionString += "_(" + gitHead[:7] + ")"
else:
  print("failed to get git hash")
  if args.gitrequired:
    print("aborting: git hash is required by --gitrequired")
    exit(-1)

#
print("building certwarden-frontend version", versionString)

# recreate paths
if os.path.exists(path_output):
  print("build output directory already exists, removing it")
  shutil.rmtree(path_output)
os.makedirs(path_output)

# build target
print("building certwarden-frontend ...")

# build binary
# result = subprocess.run(["npm", "ci"], cwd=path_src_frontend, shell=True)
# if result.returncode != 0:
#   print(f"build certwarden-frontend npm ci failed")
#   exit(-2)

result = subprocess.run(["npm", "run", "build"], cwd=path_src_frontend, shell=True)
if result.returncode != 0:
  print(f"build certwarden-frontend failed")
  exit(-2)

# move dist to the appropriate output location
shutil.move(os.path.join(path_src_frontend, "dist"), os.path.join(path_output, "frontend_build"))

print("exiting certwarden-frontend build script")
