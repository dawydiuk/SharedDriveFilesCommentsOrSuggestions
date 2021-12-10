function emailFilesNeedingApproval() 
{
  var body = ""

  //-----TODO set the to, replyTo, and subject variables-----
  var to = "someone@domain.com"
  var replyTo = "me@mydomain.com"
  var subject = "Files in xxx shared drive with open comments or suggested edits"

  //We pass in the query of what drives we are looking for, see docs for synax:
  //https://developers.google.com/drive/api/v3/search-shareddrives?authuser=2
  /*
  Query operators
  This table lists all valid query operators:

  Operator	Usage
  contains	The content of one string is present in the other.
  =	The content of a string or boolean is equal to the other.
  !=	The content of a string or boolean is not equal to the other.
  <	A value is less than another.
  <=	A value is less than or equal to another.
  >	A value is greater than another.
  >=	A value is greater than or equal to another.
  in	An element is contained within a collection.
  and	Return items that match both queries.
  or	Return items that match either query.
  not	Negates a search query.
  has	A collection contains an element matching the parameters.
  */
 
  //-----TODO set the sharedDrive name, see documentation above  
  var q = "name = 'nameSharedDrive'"
  
  sharedDrives = getSharedDrives(q)
  body = getfilesNeedingApprovalInfo(sharedDrives)
  
    MailApp.sendEmail({
      to: to,
      replyTo: replyTo,
      subject: subject,
      htmlBody: body
    });
}
