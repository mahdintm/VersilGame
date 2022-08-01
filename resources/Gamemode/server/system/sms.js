import MelipayamakApi from 'melipayamak'
const username = '9039949937';
const password = 'E3MAB';
const api = new MelipayamakApi(username, password);
const smsapi = api.sms();
const from = '50004001949937';
export class sms {
    static send(to, msg) {
        smsapi.send(to, from, msg).then(res => {
            console.log(res)
        }).catch(err => {
            //
        })
    }
}