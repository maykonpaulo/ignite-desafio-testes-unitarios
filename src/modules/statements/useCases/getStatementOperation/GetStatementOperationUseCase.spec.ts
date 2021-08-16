import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
  });

  it("Should be able to get a statement operation", async () => {
    const user = await usersRepositoryInMemory.create({
      email: "teste@teste.com",
      name: "Teste",
      password: "123"
    });

    const statement = await statementsRepositoryInMemory.create({
      amount: 100,
      description: "statement test",
      type: OperationType.DEPOSIT,
      user_id: user.id as string
    });

    const result = await getStatementOperationUseCase.execute({ user_id: user.id as string, statement_id: statement.id as string });

    expect(result).toHaveProperty("id");
  });

  it("Should not be able to get a statement operation of non exist user", async () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.create({
        email: "teste@teste.com",
        name: "Teste",
        password: "123"
      });

      const statement = await statementsRepositoryInMemory.create({
        amount: 100,
        description: "statement test",
        type: OperationType.DEPOSIT,
        user_id: user.id as string
      });

      await getStatementOperationUseCase.execute({ user_id: "123", statement_id: statement.id as string });

    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to get a non exist statement operation", async () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.create({
        email: "teste@teste.com",
        name: "Teste",
        password: "123"
      });

      await statementsRepositoryInMemory.create({
        amount: 100,
        description: "statement test",
        type: OperationType.DEPOSIT,
        user_id: user.id as string
      });

      await getStatementOperationUseCase.execute({ user_id: user.id as string, statement_id: "123" });

    }).rejects.toBeInstanceOf(AppError);
  });
});
