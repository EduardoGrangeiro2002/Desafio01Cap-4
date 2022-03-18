import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";


let usersRepositoryInMemory: IUsersRepository;
let createUserUseCase: CreateUserUseCase
describe("Create a new User", () => {
    
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  })
    it("Should be able to create a new Users", async () => {
        const user = await createUserUseCase.execute({
            email: "test@email.com",
            name: "test",
            password: "senha123"
        });        
        expect(user).toHaveProperty("id")
    })
})