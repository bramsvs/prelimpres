#! /usr/bin/python3

from subprocess import Popen

VIDS = [
    # "3v0GQX5Ptyc",
    # "8qMpE-hr2X0",
    # "shgeDmgA36I",
    # "-rJi_78Ef_E",
    # "D-988dJbSJU",
    # "oWj3ivhWr40",
    # "kq_Hgg5J-rQ", # fail compilation (big)
    # "bsHryqnvyYA", # ETH indoors
    # "ek0FrCaogcs", # ETH outdoors
    "2nDEEw3VjNU", # DJI Inspire 2
]


for vid in VIDS:
    # https://github.com/ytdl-org/youtube-dl#how-do-i-download-a-video-starting-with-a--
    proc = Popen(f"youtube-dl -f mp4 -o './downloads/%(id)s.mp4' -- {vid}", shell=True)
    proc.wait()