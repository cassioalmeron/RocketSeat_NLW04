import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import SurveysRepository from "../repositories/SurveysRepository";
import SurveysUsersRepository from "../repositories/SurveysUsersRepository";
import UsersRepository from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";
import path from 'path'
import Survey from "../models/Survey";
import { AppError } from "../errors/AppError";

class SendMailController{
    async execute(request: Request, response: Response){
        const {email, survey_id} = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({email})
        if (!user){
            return response.status(400).json({
                error: "User does not exists!"
            })
        }

        const survey = await surveysRepository.findOne({id: survey_id});
        if (!survey)
            throw new AppError('Survey does not exists!');

        let surveyUser = await surveysUsersRepository.findOne({
            where: {user_id: user.id, value: null},
            relations: ["user", "survey"]
        })

        let returnCode = 200;

        if (!surveyUser){
            surveyUser = await surveysUsersRepository.create({
                user_id: user.id,
                survey_id
            })

            await surveysUsersRepository.save(surveyUser);

            returnCode = 201;
        }

        const npsPath = path.resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');
        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: surveyUser.id,
            link: process.env.MAIL_URL
        }

        await SendMailService.execute(email, survey.title, variables, npsPath);

        return response.status(returnCode).json(surveyUser);
    }
}

export default new SendMailController();