<cffunction name="executeCommand" access="public">
    <cfargument name="command" type="string" required="true"/>
    <cfargument name="directory" type="string" required="true"/>

    <cfexecute name="C:\Windows\System32\cmd.exe" 
               arguments='/C c: && cd "#arguments.directory#" && "c:\Program Files\Git\cmd\git.exe" #arguments.command#' 
               timeout="10" variable="message" errorvariable="error_message">
    </cfexecute>

    <cfreturn [arguments.directory, arguments.command, message, error_message]>
</cffunction>

<cfscript>
    writeDump(executeCommand(command = 'diff affae4b..0a80822 --name-status', directory = 'C:\wwwroot\BOLT_sites\palmetto'));
</cfscript>

<cfexecute name="C:\Windows\System32\NETSTAT.EXE" arguments="-e" 
           outputfile="C:\wwwroot\BOLT_sites\palmetto\githubTool\output.txt" timeout="1">
</cfexecute>