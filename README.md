# Vesting + Gauges + Voting
Like curve or pickle

ve-asset and gaugeproxy implementation (can be used to turn SPIRIT into veSPIRIT and then instead of direct emissions with direct multipliers can have users vote on gauges, creates more scarcity and utility for spirit) https://github.com/pickle-finance/contracts


## Concept:


*** won't be covered in this repo, but it should be true for this to be viable
  Project is a farming based protocol
  Users can deposit funds into Vaults and earn TOK as a reward.
***


### Feature 1: Ve-asset:

Project has a token (we call this "TOK")
Users can lock up their TOK for a period and they receive "veTOK" (longer the lock, more veTOK is received)

### Feature 2: Gauges

Gauge weighting is the {total amount of veTOK voting for the gauge} / {total amount of veTOK ~that has voted?~}
The rewarded TOK per Vault is calculated based on "Gauge weighting"
Display the current gauge weighting as well as the pending gauge weighting
Show current reward ratio and pending reward ratio per vault

### Feature 3: Voting

Users can vote for a gauge or multiple gauges using their veTOK
