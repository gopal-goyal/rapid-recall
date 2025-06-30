# This file contains the fixes and there walkthroughs

## URL redirect, refreshing

- check if room exists, playerid exitst in local storage and in room, there is a host 
    - YES: check playerid matches any disconnected playerid 
    - NO: then redirect to home(gracefully)