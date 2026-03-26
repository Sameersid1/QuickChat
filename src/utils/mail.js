import mailgen from 'mailgen'
import nodemailer from 'nodemailer'

const sendEmail=async(options)=>{
    const mailGenerator=new mailgen({
        theme:"default",
        product:{
            name:"Quick Chatter",
            link:"https://quickChatter.com"
        }
    })
    const emailTextual=mailGenerator.generatePlaintext(options.mailgenContent)

    const emailHtml=mailGenerator.generate(options.mailgenContent)

    const transporter=nodemailer.createTransport({
        host:process.env.MAILTRAP_SMTP_HOST,
        pass:process.env.MAILTRAP_SMTP_PASS
    })
    const mail={
        from:"mail.quickchat@wxample.com",
        to:options.email,
        subject:options.subjects,
        text:emailTextual,
        tml:emailHtml
    }
    try{
        await transporter.sendMail(mail)
    }catch(error){
        console.error("Email service failer silently.Make sure you provided MAILTRAP credentials in .env file")
        console.error("Error: ",error)
    }
}

const emailVerificationMailContent=(username,verificationUrl)=>{
    return{
        body:{
            name:username,
            intro:"Welcme to our app! we are excited to have on board",
            action:{
                instructions:"To verify your mail please click on the following button",
                button:{
                    color:"#22BC66",
                    text:"Verify your mail",
                    link:verificationUrl
                }
            },
            outro:"Need Help or have questions? Just reply to this email.We would love to help"
        }
    }
}
const forgotPasswordMailContent=(username,ResetPasswordUrl)=>{
    return{
        body:{
            name:username,
            intro:"We got a request to reset your Password",
            action:{
                instructions:"To reset your password click on the following button or link",
                button:{
                    color:"#22BC66",
                    text:"Rest Password",
                    link:ResetPasswordUrl,
                },
            },
            outro:"Need Help or have questions? Just reply to this email.We would love to help"
        }
    }
}
export {
    emailVerificationMailContent,
    forgotPasswordMailContent,
    sendEmail
}