import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import UsersRepository from "../repositories/UsersRepository";
import * as yup from 'yup'
import { AppError } from "../errors/AppError";

class UserController{
    async create(request: Request, response: Response){
        // if (!(await schema.isValid(request.body)))
        //     return response.status(400).json({error: 'Validation Failed!'})

        try{
            await schema.validate(request.body, {abortEarly: false});
        }catch(err){
            throw new AppError(err);
        }
        
        const {name, email} = request.body;

        const usersRepository = getCustomRepository(UsersRepository);

        const userAlreadyExists = await usersRepository.findOne({email});
        if (userAlreadyExists)
            throw new AppError('E-mail já cadastrado!');

        const user = usersRepository.create({
            name, email
        })

        await usersRepository.save(user);

        return response.status(201).json(user);
    }
}

const schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
})

export default new UserController();