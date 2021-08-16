import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";

import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

import { AppError } from "@shared/errors/AppError";

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile", () => {
  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  });

  it("Should be able to show user profile", async () => {
    const user = await createUserUseCase.execute({
      email: "user@test.com",
      name: "user",
      password: "pass"
    });

    const result = await showUserProfileUseCase.execute(user.id as string);

    expect(result.email).toEqual("user@test.com");
  });

  it("Should not be able to show profile of non exist user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("123");

    }).rejects.toBeInstanceOf(AppError);
  });
});
