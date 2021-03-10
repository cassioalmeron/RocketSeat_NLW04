import { Column, Entity } from "typeorm";
import ModelBase from "./ModelBase";

@Entity("surveys")
class Survey extends ModelBase{
    
    @Column()
    title: string;

    @Column()
    description: string;
}

export default Survey