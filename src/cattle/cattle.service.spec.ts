import { Test, TestingModule } from '@nestjs/testing';
import { CattleService } from './cattle.service';

describe('CattleService', () => {
    let service: CattleService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CattleService],
        }).compile();

        service = module.get<CattleService>(CattleService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
