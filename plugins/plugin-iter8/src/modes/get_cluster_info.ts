import {  Arguments } from '@kui-shell/core'
import { KubeOptions } from '@kui-shell/plugin-kubectl'

function parseData(data: string): Array<string> {
	var dataArr = data.split(" ")
	return dataArr
}

export async function getNsData(args: Arguments<KubeOptions>): Promise<Array<string>>{
	const { parsedOptions: options, REPL } = args
	const cmd = `kubectl get ns -o=jsonpath='{range .items[*]}{.metadata.name}{" "}'`	
	return parseData(await(REPL.qexec(cmd)))
}