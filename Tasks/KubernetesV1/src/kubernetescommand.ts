"use strict";
import * as del from "del";
import * as fs from "fs";
import * as tr from "vsts-task-lib/toolrunner";
import trm = require('vsts-task-lib/toolrunner');
import * as path from "path";
import * as tl from "vsts-task-lib/task";
import * as utils from "./utilities";
import ClusterConnection from "./clusterconnection";

export function run(connection: ClusterConnection, kubecommand: string, outputUpdate: (data: string) => any): any {
    var command = connection.createCommand();
    command.on("stdout", output => {
        outputUpdate(output);
    });

    command.arg(kubecommand)
    command.arg(getNameSpace());
    command.arg(getCommandConfigurationFile());
    command.line(getCommandArguments());
    command.arg(getCommandOutputFormat());
    return connection.execCommand(command);
}

function getCommandOutputFormat() : string[] {
    var args: string[] =[];
    var outputFormat = tl.getInput("outputFormat", false);
    if(outputFormat)
    {
        args[0] = "-o";
        args[1] = outputFormat;
    }
   
    return args;
}

function getCommandConfigurationFile() : string[] {
    var args: string[] =[];
    var useConfigurationFile : boolean  =  tl.getBoolInput("useConfigurationFile", false);
    if(useConfigurationFile) {
        var configurationPath = tl.getInput("configuration", false);
        if(configurationPath && tl.exist(configurationPath))
        {
            args[0] = "-f";
            args[1] = configurationPath;
        }
    }

    return args;
}

function getCommandArguments(): string {
    return tl.getInput("arguments", false);
}

export function getNameSpace(): string[] {
	var args: string[] =[];
	var namespace = tl.getInput("namespace", false);	
	if(namespace) {
		args[0] = "-n";
        args[1] = namespace;
	}
	
	return args;
}