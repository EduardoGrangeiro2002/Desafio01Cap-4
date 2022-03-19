import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "src/modules/users/repositories/IUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO"
import { OperationType } from "../../entities/Statement"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase"
import { ICreateStatementDTO } from "./ICreateStatementDTO"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { AppError } from "../../../../shared/errors/AppError"



let usersRepositoryInMemory: IUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase
let createStatement: CreateStatementUseCase
let statementRepository: IStatementsRepository

describe("Create Statement", () => {
  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    statementRepository = new InMemoryStatementsRepository()
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
    createStatement = new CreateStatementUseCase(usersRepositoryInMemory, statementRepository)
    })

    it("Should be able to create a new Statement", async () => {
        const user: ICreateUserDTO = {
            email: "test@email.com",
            name: "User123",
            password: "senha123"
        }
        await createUserUseCase.execute(user);

        const tokenUser = await authenticateUserUseCase.execute({email: user.email, password: user.password})


        const statement: ICreateStatementDTO = {
            amount: 720,
            description: "Venda de app",
            user_id: tokenUser.user.id as string,
            type: OperationType.DEPOSIT
        }

        const newStatement = await createStatement.execute(statement);
        
        expect(newStatement).toHaveProperty("id");
        expect(newStatement).toHaveProperty("amount");
    })

    it("Should not be able to create a statement to a non-existant user", async () => {
        expect(async () => {
          await createStatement.execute({
            amount: 720,
            description: "Venda de app",
            user_id: "not-exists",
            type: OperationType.DEPOSIT
          })
        }).rejects.toBeInstanceOf(AppError)
    })

    it("Should not be able to withdraw money if insufficient founds", async () => {
      const user: ICreateUserDTO = {
        email: 'edu@gmail.com',
        name: "edu",
        password: '123'
      }

      await createUserUseCase.execute(user);

      const tokenUser = await authenticateUserUseCase.execute({email: user.email, password: user.password})

      expect(async () => {
        await createStatement.execute({
          amount: 1000,
          description: "Despesas",
          type: OperationType.WITHDRAW,
          user_id: tokenUser.user.id as string
        })
      }).rejects.toBeInstanceOf(AppError)

    })
})