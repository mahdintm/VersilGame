import * as alt from 'alt';
var veiws = {};

export class webview_tools {
    /**
     * for create WebView
     * @param {*} name 
     * @param {*} veiwobj 
     */
    constructor(link, name) {
        this.web = new alt.WebView(link);
        this.name = name
        this.status = false
        this.setchange = (state) => { return veiws[this.name]["state"] = state }
        this.getstate = () => {
            let arr = Object.entries(veiws)
            for (let i = 0; i < arr.length; i++) {
                if (arr[0][1]['state'] == true) {
                    return false
                }
                if (arr.length == i + 1) {
                    return true
                }
            }
        }
        veiws[name] = {
            link: this.obj,
            name: this.name,
            state: this.status
        }
    }
}