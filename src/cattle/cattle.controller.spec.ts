import { Test, TestingModule } from '@nestjs/testing';
import { CattleController } from './cattle.controller';

describe('CattleController', () => {
    let controller: CattleController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CattleController],
        }).compile();

        controller = module.get<CattleController>(CattleController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

});
