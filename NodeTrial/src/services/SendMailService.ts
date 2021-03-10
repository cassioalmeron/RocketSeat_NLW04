import nodemailer, { Transporter } from 'nodemailer'
import handlebars from 'handlebars'
import fs from 'fs'

class SendMailService{

    private client: Transporter

    constructor(){
        nodemailer.createTestAccount()
            .then(account => {
                
                const config = {
                    host: account.smtp.host,
                    port: account.smtp.port,
                    secure: account.smtp.secure,
                    auth: {
                        user: account.user,
                        pass: account.pass
                    }
                }

                const transporter = nodemailer.createTransport(config);

                this.client = transporter;
            })

        //          const config = {
        //             host: process.env.MAIL_HOST || '',
        //             port: process.env.MAIL_PORT|| '',
        //             secure: false,
        //             auth: {
        //                 user: process.env.MAIL_USER || '',
        //                 pass: process.env.MAIL_PASS || ''
        //             }
        //         }

        // console.log(config);
        
        //const transporter = nodemailer.createTransport(config);

        //this.client = transporter;
    }
    
    async execute(to: string, subject: string, variables: object, path: string){
        const templateFileContent = fs.readFileSync(path).toString("utf8");
        const mailTemplateParse = handlebars.compile(templateFileContent);
        
        const html = mailTemplateParse(variables)

        await this.client.sendMail({
                to, 
                subject, 
                html,
                from: 'NPS <noreplay@cassioiclen.com.br>'
            })
            .then(message => {
                 console.log(`Message sent: ${message.messageId}`);
                 console.log(`Preview URL: ${nodemailer.getTestMessageUrl(message)}`, );
            })
            .catch(err => {
                console.log(err)
            });
    }
}

export default new SendMailService();