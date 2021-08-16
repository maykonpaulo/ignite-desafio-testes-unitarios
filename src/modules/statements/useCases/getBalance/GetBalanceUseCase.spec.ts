import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersRepositoryInMemory);
  });

  it("Should be able to get a user balance", async () => {
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

    const result = await getBalanceUseCase.execute({ user_id: user.id as string });

    expect(result.statement.length).toBeGreaterThan(0);
  });

  it("Should not be able to get balance of non exist user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "123" });

    }).rejects.toBeInstanceOf(AppError);
  });
});
