CS456 UWaterloo Spring 2023 Assignment 2
Mahan Sharifi-Ghazvini


Background INFO:
TO RUN THE RECIEVER:
 <hostname for the network emulator>,
 <UDP port number used by the link emulator to receive ACKs from the receiver>,
 <UDP port number used by the receiver to receive data from the emulator>, and
 <name of the file into which the received data is written>. 

TO RUN THE SENDER:
 <host address of the network emulator>,
 <UDP port number used by the emulator to receive data from the sender>,
 <UDP port number used by the sender to receive ACKs from the emulator>,
 <timeout interval in units of millisecond>, and
 <name of the file to be transferred> 

TO RUN THE NETWORK_EMULATOR:
• <emulator's receiving UDP port number in the forward (sender) direction>,
• <receiver's network address>,
• <receiver's receiving UDP port number>,
• <emulator's receiving UDP port number in the backward (receiver) direction>,
• <sender's network address>,
• <sender's receiving UDP port number>,
• <maximum delay of the link in units of millisecond>,
• <packet discard probability>, and
• <verbose-mode> (Boolean: If set to 1, the network emulator will output its internal processing). 



To run this program please do the following:
1. have an input.txt file. Make sure to provide some input
2. Create an empty output.txt file
3. Ensure the execution permissions on the sender.py and receiver.py are allowed


Example Execution in the given order:
1. On the host host1: network_emulator 9991 host2 9994 9993 host3 9992 1 0.2 0
2. On the host host2: receiver host1 9993 9994 <output File>
3. On the host host3: sender host1 9991 9992 50 <input file>

For host1: ubuntu2004-004
For host2: ubuntu2204-002
For host3: ubuntu2004-008

EMULATOR:
Built and Tested on ubuntu2004-004

Receiver:
Built and Tested on ubuntu2004-002 

Sender:
Built and Tested on ubuntu2004-008

Instruction:
You need to ssh into each (network, emulator, and reciever).student.cs.uwaterloo.ca 


Used Python 3.10.6.

IDE used: VS Code

