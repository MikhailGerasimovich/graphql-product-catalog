import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CommandProductRepository } from '../../../infrastructure';
import { UpdateProductCommand } from '../impl';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(private readonly repository: CommandProductRepository) {}

  async execute(command: UpdateProductCommand): Promise<any> {
    //   const { productId, updateProductInput } = command;
    //   return await this.repository.update(productId, updateProductInput);
  }
}
