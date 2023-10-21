import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CommandProductRepository } from '../../../infrastructure';
import { DeleteProductCommand } from '../impl';

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler implements ICommandHandler<DeleteProductCommand> {
  constructor(private readonly repository: CommandProductRepository) {}

  async execute(command: DeleteProductCommand): Promise<any> {
    const { productId } = command;
    return await this.repository.delete(productId);
  }
}
