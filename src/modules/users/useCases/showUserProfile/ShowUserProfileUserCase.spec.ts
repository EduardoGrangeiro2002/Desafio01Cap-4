import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"



let usersRepositoryInMemory: IUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase
let showProfileUseCase: ShowUserProfileUseCase
describe("Create Statement", ()=> {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    showProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory)
    })

  it("Should be able to show profile", async () => {
    const user: ICreateUserDTO = {
        email: "eduardo@email.com",
        name: "Eduardo",
        password: "senha123"
    }
    await createUserUseCase.execute(user);

    const userToken = await authenticateUserUseCase.execute({email: user.email, password: user.password})
    
    const profile = await showProfileUseCase.execute(userToken.user.id as string)


    expect(profile).toHaveProperty("id");
    expect(profile).toHaveProperty("email");
  })
  })