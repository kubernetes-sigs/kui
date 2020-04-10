import { Tab } from '@kui-shell/core'

function parseData(data: string): Array<Object> {
	var dataArr = data.split(" ")
	var dict = []
	for(let i = 0; i < dataArr.length-1; i++){
    dict.push({
        id: 'ns-'+i,
        text: dataArr[i]
    })
	}
	return dict
}

export async function getNsData(tab: Tab): Promise<Array<Object>>{
	const cmd = `kubectl get ns -o=jsonpath='{range .items[*]}{.metadata.name}{" "}'`	
	return parseData(await(tab.REPL.qexec(cmd)))
}