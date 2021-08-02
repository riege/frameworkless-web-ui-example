import { schema } from '../../libs/normalizr.es.js'

export const address = new schema.Entity('addresses');

export const shipment = new schema.Entity(
    'shipment',
    {
        'shipper': address,
        'consignee': address
    }
);