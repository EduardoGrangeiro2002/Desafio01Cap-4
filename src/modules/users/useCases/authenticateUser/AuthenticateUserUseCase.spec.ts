import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"


let usersRepositoryInMemory: IUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase
describe("Login to users", () => {
  
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    })
  it("Should be able to login User", async () => { 
    const user: ICreateUserDTO = {
        email: "test@email.com",
        password: "senha123",
        name: "UserTest"
    }

    await createUserUseCase.execute(user);

    const UserToken = await authenticateUserUseCase.execute({
        email: "test@email.com",
        password: "senha123"
    });

    expect(UserToken).toHaveProperty("token")
    expect(UserToken).toHaveProperty("user")
    })
    it("should not be able to authenticate a non-existant user", async () => {
      const userLoginData = {
        email: "teste@gmail.com",
        password: "12313",
      };
  
      expect(async () => {
        await authenticateUserUseCase.execute(userLoginData);
      }).rejects.toBeInstanceOf(AppError);
    });
  
    it("should not be able to authenticate a user with wrong password", async () => {
      const user: ICreateUserDTO = {
        email: "test@email.com",
        password: "senha123",
        name: "UserTest"
    }
  
      await createUserUseCase.execute(user);
  
      expect(async () => {
        await authenticateUserUseCase.execute({
          email: user.email,
          password: "wrong-password",
        });
      }).rejects.toBeInstanceOf(AppError);
    });
  })