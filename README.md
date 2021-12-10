# SharedDriveFilesCommentsOrSuggestions

If you use Google Shared Drives and use the comment or suggested edit features, then you may want to know what files have open comments or suggested edits, but unfortunately Google doesn't offer any way to do this other than opening every file... This script demonstrates how to send an HTML formatted email with links to any Google documents in the shared drives specified that have open comments or suggested edits.

The scripts require that one enable the services Docs and Drive.

To use this script 
<ol>
  <li>Rename emailExample.gs to a more intuitive name for your application, you can copy this file if you want different emails for different shared drives.
  </li>
  <li>Edit emailExample.gs and set the to, replyTo, and subject variables for the resulting email and edit the variable q to<br /> 
    <br />    

```
    //-----TODO set the to, replyTo, and subject variables-----
    var to = "someone@domain.com"<br />
    var replyTo = "me@mydomain.com"<br />
    var subject = "Files in xxx shared drive with open comments or suggested edits"
```
    
    
  </li>
  
  <li> Edit emailExample.gs and set the to, replyTo, and subject variables for the resulting email and edit the variable q to. 
    <br />See <a href=https://developers.google.com/drive/api/v3/search-shareddrives?authuser=2>Search for shared drives</a> documentation for syntax<br /><br /> 

``` 
  //-----TODO set the sharedDrive name, see documentation above
  var q = "name = 'nameSharedDrive'"
```
  </li>
  <li>
    See <a href=https://developers.google.com/apps-script/guides/triggers/installable#time-driven_triggers>Time-drive Trigger</a> documentation if you'd like to schedule the script to run periodically.
  </li>
  </ol>

<br />Note: filesNeedingApproval.gs should not need to be changed unless you would like to change the functionality of how the script works.

# Important 

Google script APIs limit the maximum CPU time that can be consumed(30 min for paid account), and unfortunately the APIs currently require one parse the content of every Google Document to find suggested edits which can be quite time consuming depending upon how much content is in each document and how many documents you have. As a result you should consider setting up multiple emailExample.gs files for different shared drives to minimize the cpu time. 
