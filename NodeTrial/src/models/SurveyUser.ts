import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import ModelBase from "./ModelBase";
import Survey from "./Survey";
import User from "./User";

@Entity("surveys_users")
class SurveyUser extends ModelBase{
    
    @Column()
    user_id: string;

    @ManyToOne(() => User)
    @JoinColumn({name: "user_id"})
    user: User;

    @Column()
    survey_id: string;

    @ManyToOne(() => Survey)
    @JoinColumn({name: "survey_id"})
    survey: Survey;

    @Column()
    value: number;
}

export default SurveyUser