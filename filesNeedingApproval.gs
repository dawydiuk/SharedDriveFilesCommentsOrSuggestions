/********************************************************************************************
 * For the array of sharedDrives passed in, return an HTML formatted string listing each
 * shared drive followed by a link to every file in that drive that has an open comment or
 * suggestion
 ********************************************************************************************/
function getfilesNeedingApprovalInfo(sharedDrives)
{
  var body = "<small>This email contains a list of Google docs that have open comments or suggested edits</small><br />\n"  

  if(sharedDrives == null) 
  {
    Logger.log("Nothing to do sharedDrives is empty");
    return;
  }

  for (var i = 0; i < sharedDrives.length; i++)
  {
    Logger.log("->%s", sharedDrives[i].name)
    body += "<h1>" + sharedDrives[i].name + "</h1>\n"
    folder = DriveApp.getFolderById(sharedDrives[i].id)

    response = getFilesNeedApproval(folder)
    if(response.items.length > 0)
    {
      for(var j = 0; j < response.items.length; j++)
        body += "<a href=" + response.items[j].getUrl() + ">" +response.items[j] + "</a><br />\n"

    } else 
    {
      body += "No open comments on any files in this shared drive.<br />\n"
    }

    if(response.errors.length > 0)
    {
      body += "<hr /><small>Errors:<br />\n"

      for(var j = 0; j < response.errors.length; j++)
        body += response.errors[j] + "<br />\n"
 
      body += "</small><hr />\n"
    }
  }
  return body
}

/********************************************************************************************
 * Recursive function to find all files in a given folder and calls itself for all subfolders
 * Returns an array of Files that need approval, that is they have open comments or open
 * suggested edits
 ********************************************************************************************/
function getFilesNeedApproval(folder, filesNeedApproval, errors) { 

  //initial call to this recursive function will have filesNeedApproval unset so initialize the array
  var filesNeedApproval = filesNeedApproval || []
  var errors = errors || []

  //ignore pdf, excel docs etc as we only care about files with suggested edits or comments
  var files = folder.getFilesByType(MimeType.GOOGLE_DOCS)
  while(files.hasNext()) 
  {
    var file = files.next()
    Logger.log("Checking file: %s", file)

    try{

      if(needsApproval(file)){
        filesNeedApproval.push(file)
        Logger.log("\t====>Needs approval")
      }
        

    } catch(err)
    {
      Logger.log("\t---->An Error occurred(%s)", err)
      errors.push(err)
    }
  }

  var subfolders=folder.getFolders() 
  while(subfolders.hasNext()) 
  {
    var subfolder=subfolders.next()
    getFilesNeedApproval(subfolder, filesNeedApproval, errors);
  }

  return {items: filesNeedApproval, errors: errors};  
}

/********************************************************************************************
 * Returns true if the file has an open comment (COMING SOON: or suggested edit)
 * Throws error if unable to read from a file
 ********************************************************************************************/
function needsApproval(file)
{
  if(hasUnresolvedComments(file) || hasSuggestedEdits(file))
    return true
  
  return false
}

/********************************************************************************************
 * Returns all shared drives that do not contain sandbox or archive in the name
 ********************************************************************************************/
function getSharedDrives(q) 
{
  var pageToken
  var sharedDrives = []
  
  do 
  {
    //Get a list of Shared Drives
    var optionalArgs = {pageToken: pageToken, q: q}  
    var response = Drive.Drives.list(optionalArgs)//.items
    pageToken = response.nextPageToken
    sharedDrives = sharedDrives.concat(response.items)
    
  } while(pageToken)

  if(sharedDrives)
    Logger.log("query [" + q + "] returned %d shared drives.", sharedDrives.length);
  else
    Logger.log("query [" + q + "] didn't return any shared drives. Nothing to do!");
  
  return sharedDrives;
}


/********************************************************************************************
 * Returns true of there are any suggested edits, else false
 * 
 * Unfortunately the Google APIs require we parse the content of the document which is
 * relatively time consuming, so we only partse Google Docs type documents.
 ********************************************************************************************/
function hasSuggestedEdits(file)
{
  if(file.getMimeType() == "application/vnd.google-apps.document")
  {
    var doc = Docs.Documents.get(file.getId())

    //doc.body.content.forEach(function (content)
    for(var i = 0; i < doc.body.content.length; i++)
    {
      var content = doc.body.content[i]

      if (content.paragraph) 
      {
        var elements = content.paragraph.elements

        //elements.forEach(function (element)
        for(var j = 0; j < elements.length; j++)
        {
          if(elements[j].textRun == null)
            continue

          if(elements[j].textRun.suggestedDeletionIds || elements[j].textRun.suggestedInsertionIds)
          {
            Logger.log("======Detected Suggested Edit!!!!!!===========")
            return true
          }            
        }
      }
    }
  } 
  return false
}


/********************************************************************************************
 * Google Docs type documents are checked for unresloved comments. Returns true if there are
 *  any unresolved comments, else false
 ********************************************************************************************/
function hasUnresolvedComments(file)
{
  //if not a Google Doc don't check for comments
  if(file.getMimeType() != "application/vnd.google-apps.document")
    return false

  comments = Drive.Comments.list(file.getId())
  if(!comments || comments.length == 0)
    return false
     
  for(var i = 0; i < comments.items.length; i++)
    if(comments.items[i].status == "open")
    {
      Logger.log("Open comment found: " + comments.items[i])
      return true
    }
   
  return false
}

