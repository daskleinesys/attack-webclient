import { subscribableDataStore } from '@/shared/storeMixins/subscribableDataStore';

const areas = subscribableDataStore('/api/areas');

export default areas;
