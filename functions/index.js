var functions = require('firebase-functions');

const sendgrid = require('sendgrid');
const client = sendgrid('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');

function parseBody(body){
    var helper = sendgrid.mail;
    var fromEmail = new helper.Email(body.fromEmail);
    var toEmail = new helper.Email(body.toEmail);
    var subject = body.subject;
    var content = new helper.Content('text/html', body.content);
    var mail = new helper.Mail(fromEmail, subject, toEmail, content);
    return mail.toJSON();
}

exports.Email = functions.https.onRequest((req, res)=> {
    return Promise.resolve()
    .then(() => {
        if(req.method !== 'POST'){
            const error = new Error('Only POST request are accpepted');
            
            throw error;
        }

        const request = client.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: parseBody(req.body)
        });

        return client.API(request);
    })
    .then((response) => {
        if(response.body){
            res.send(response.body);
        } else{
            res.end();
        }
    })
    .catch((err) => {
        console.error(err);
        return Promise.reject(err);
    });
})