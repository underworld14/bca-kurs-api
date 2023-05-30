import 'regenerator-runtime';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { DateTime } from 'luxon';
import app from 'app';
import { expect } from 'chai';
import request from 'supertest';
import nock from 'nock';
import { kursPayload } from '__fixtures__/kurs';

const prisma = new PrismaClient();

describe('Kurs Api Integration', () => {
  let kursBcaHtml;

  before(async () => {
    kursBcaHtml = fs.readFileSync('src/__fixtures__/kurs.html', 'utf8');
    await prisma.$transaction([prisma.kurs.deleteMany()]);
  });

  after(async () => {
    await prisma.$disconnect();
  });

  describe('[GET] /api/indexing', () => {
    it('Should be able to index exchange rate data from BCA', (done) => {
      nock('https://www.bca.co.id').get('/id/informasi/kurs').reply(200, kursBcaHtml);

      request(app)
        .get('/api/indexing')
        .expect(200)
        .end((err, res) => {
          expect(res.body.message).to.equal('success');
          expect(res.body.data.count).to.equal(16);
          done();
        });
    });

    it('Should not be able to indexing same data', (done) => {
      nock('https://www.bca.co.id').get('/id/informasi/kurs').reply(200, kursBcaHtml);

      request(app)
        .get('/api/indexing')
        .expect(200)
        .end((err, res) => {
          expect(res.body.message).to.equal('success');
          expect(res.body.data.count).to.equal(0);
          done();
        });
    });
  });

  describe('[GET] /api/kurs', () => {
    it('Should be able to get exchange rate data', (done) => {
      request(app)
        .get('/api/kurs')
        .expect(200)
        .end((err, res) => {
          expect(res.body.message).to.equal('success');
          expect(res.body.data.length).to.equal(16);
          done();
        });
    });

    it("Should be able to store exchange rate data if it doesn't exist", (done) => {
      request(app)
        .post('/api/kurs')
        .send(kursPayload)
        .expect(200)
        .end((err, res) => {
          expect(res.body.message).to.equal('success');
          expect(res.body.data).to.deep.equal(kursPayload);
          done();
        });
    });

    it("Should skip store exchange rate data if it's already exist", async () => {
      return request(app)
        .post('/api/kurs')
        .send(kursPayload)
        .expect(200)
        .then(async (res) => {
          expect(res.body.message).to.equal('success');
          expect(res.body.data).to.deep.equal(kursPayload);

          // make sure data is not duplicated
          const testdatas = await prisma.kurs.findMany({
            where: {
              symbol: kursPayload.symbol,
              date: DateTime.fromISO(kursPayload.date).toJSDate(),
            },
          });

          expect(testdatas.length).to.equal(1);
        });
    });

    it('Should be able to get exchange rate data by date', (done) => {
      request(app)
        .get('/api/kurs?startdate=2023-05-29&enddate=2023-05-29')
        .expect(200)
        .end((err, res) => {
          expect(res.body.message).to.equal('success');
          expect(res.body.data.length).to.equal(16);
        });

      request(app)
        .get('/api/kurs?startdate=2023-05-01&enddate=2023-05-02')
        .expect(200)
        .end((err, res) => {
          expect(res.body.message).to.equal('success');
          expect(res.body.data.length).to.equal(0);
        });

      request(app)
        .get('/api/kurs?startdate=2023-06-14&enddate=2023-06-14')
        .expect(200)
        .end((err, res) => {
          expect(res.body.message).to.equal('success');
          expect(res.body.data.length).to.equal(1);
          expect(res.body.data[0].symbol).to.equal('EUR');
          done();
        });
    });

    it('Should be able to update exchange rate data', (done) => {
      const updatePayload = {
        ...kursPayload,
        e_rate: {
          beli: 10000,
          jual: 11000,
        },
        tt_counter: {
          beli: 12000,
          jual: 13000,
        },
        bank_notes: {
          beli: 14000,
          jual: 15000,
        },
      };

      request(app)
        .put('/api/kurs')
        .send(updatePayload)
        .expect(200)
        .end((err, res) => {
          expect(res.body.message).to.equal('success');
          expect(res.body.data).to.deep.equal(updatePayload);
          done();
        });
    });

    it('Should not be able to update exchange rate data if it does not exist', (done) => {
      const updatePayload = {
        ...kursPayload,
        symbol: 'IDR',
        e_rate: {
          beli: 10000,
          jual: 11000,
        },
        tt_counter: {
          beli: 12000,
          jual: 13000,
        },
        bank_notes: {
          beli: 14000,
          jual: 15000,
        },
      };

      request(app)
        .put('/api/kurs')
        .send(updatePayload)
        .expect(404)
        .end((err, res) => {
          expect(res.body.message).to.equal('data not found');
          done();
        });
    });

    it('Should be able to delete exchange rate data by date', () => {
      return request(app)
        .delete(`/api/kurs/${kursPayload.date}`)
        .expect(204)
        .then(async () => {
          // make sure data is deleted
          const testdatas = await prisma.kurs.findMany({
            where: {
              date: DateTime.fromISO(kursPayload.date).toJSDate(),
            },
          });

          expect(testdatas.length).to.equal(0);
        });
    });

    it('Should be able to get exchange rate data by currency', (done) => {
      request(app)
        .get('/api/kurs/USD')
        .expect(200)
        .end((err, res) => {
          expect(res.body.message).to.equal('success');
          expect(res.body.data.length).to.equal(1);
          expect(res.body.data[0].symbol).to.equal('USD');
          done();
        });
    });
  });
});
