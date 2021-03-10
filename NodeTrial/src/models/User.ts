import { Column, Entity } from "typeorm";
import ModelBase from "./ModelBase";

@Entity("users")
class User extends ModelBase{
    @Column()
    name: string;

    @Column()
    email: string;
}

export default User