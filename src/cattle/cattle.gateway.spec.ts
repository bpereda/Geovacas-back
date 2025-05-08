import { Test, TestingModule } from '@nestjs/testing';
import { CattleGateway } from './cattle.gateway';

describe('CattleGateway', () => {
    let gateway: CattleGateway;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CattleGateway],
        }).compile();

        gateway = module.get<CattleGateway>(CattleGateway);
    });

    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });
});
