import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export function generateOneInvoice(payment: any, type: string) {
  const company = payment['company'];
  const isPartnerCompany = payment['isPartnerCompany'];
  const partner = isPartnerCompany
    ? payment['partner_company']
    : payment['partner_person'];
  let partnerCompanyData = [];
  let phone_email = '';
  if (partner.phone) {
    phone_email = `Tel. ${partner.phone}\t`;
  }
  if (partner.email) {
    phone_email = phone_email + `Email ${partner.email}`;
  }
  if (isPartnerCompany) {
    partnerCompanyData = [
      {
        text: `${partner.name.toUpperCase()}`,
        fontSize: 10,
        bold: true,
        margin: [0, 0, 0, 5],
      },
      {
        text: `CIF ${partner.cui}\t\tRC ${partner.rc}`,
        fontSize: 10,
        bold: true,
        margin: [0, 0, 0, 5],
      },
      {
        text: ' ',
        fontSize: 10,
        margin: [0, 0, 0, 2],
      },
      {
        text: partner.address_secondary
          ? partner.address_secondary
          : partner.address,
        fontSize: 10,
        margin: [0, 0, 0, 2],
      },
      {
        text: phone_email,
        fontSize: 10,
        margin: [0, 0, 0, 2],
      },
      {
        text: partner.bank_name ? partner.bank_name : ' ',
        fontSize: 10,
        margin: [0, 0, 0, 2],
      },
      {
        text: partner.iban,
        fontSize: 10,
        margin: [0, 0, 0, 2],
      },
    ];
  } else {
    partnerCompanyData = [
      {
        text: `${partner.name.toUpperCase()}`,
        fontSize: 10,
        bold: true,
        margin: [0, 0, 0, 5],
      },
      {
        text: `CNP ${partner.cnp}`,
        fontSize: 10,
        bold: true,
        margin: [0, 0, 0, 5],
      },
      {
        text: ' ',
        fontSize: 10,
        margin: [0, 0, 0, 2],
      },
      {
        text: partner.address,
        fontSize: 10,
        margin: [0, 0, 0, 2],
      },
      {
        text: phone_email,
        fontSize: 10,
        margin: [0, 0, 0, 2],
      },
      {
        text: partner.bank_name ? partner.bank_name : ' ',
        fontSize: 10,
        margin: [0, 0, 0, 2],
      },
      {
        text: partner.iban,
        fontSize: 10,
        margin: [0, 0, 0, 2],
      },
    ];
  }
  let docDefinition = {
    content: [
      {
        columns: [
          [
            {
              text: 'Factura',
              fontSize: 14,
              alignment: 'left',
              margin: [0, 0, 0, 0],
            },
            {
              text: `Serie ${payment.series}\tNumar ${payment.number}`,
              fontSize: 10,
              margin: [0, 5, 0, 5],
            },
            {
              text: `Data ${payment.receipt_date}`,
              fontSize: 10,
              margin: [0, 5, 0, 5],
            },
          ],
          [
            { text: ' ', fontSize: 10 },
            { text: ' ', fontSize: 10 },
            {
              text: '-RON-',
              fontSize: 10,
              alignment: 'right',
            },
          ],
        ],
      },
      {
        columns: [
          {
            text: 'Furnizor',
            fontSize: 8,
            margin: [0, 10, 0, 0],
          },

          {
            text: 'Client',
            fontSize: 8,
            margin: [0, 10, 0, 0],
          },
        ],
      },
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }],
        margin: [0, 2, 0, 10],
      },
      {
        columns: [
          [
            {
              text: `${company.name.toUpperCase()}`,
              fontSize: 10,
              bold: true,
              margin: [0, 0, 0, 5],
            },
            {
              text: `CIF ${company.cui}\t\tRC ${company.rc}`,
              fontSize: 10,
              bold: true,
              margin: [0, 0, 0, 5],
            },
            {
              text: 'Capital soc. 200 RON',
              fontSize: 10,
              margin: [0, 0, 0, 2],
            },
            {
              text: `${company.address}`,
              fontSize: 10,
              margin: [0, 0, 0, 2],
            },
            {
              text: `Tel. ${company.phone}\tEmail ${company.email}`,
              fontSize: 10,
              margin: [0, 0, 0, 2],
            },
            {
              text: company.bank_name,
              fontSize: 10,
              margin: [0, 0, 0, 2],
            },
            {
              text: company.iban,
              fontSize: 10,
              margin: [0, 0, 0, 2],
            },
          ],
          partnerCompanyData,
        ],
      },
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }],
        margin: [0, 2, 0, 3],
      },
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }],
        margin: [0, 2, 0, 10],
      },
      {
        columns: [
          {
            text: 'Nr. crt.',
            fontSize: 8,
            width: '10%',
            margin: [0, 0, 0, 0],
          },
          {
            text: 'Denumire produse/ servicii',
            fontSize: 8,
            width: '40%',
            margin: [0, 0, 0, 0],
          },
          {
            text: 'UM',
            fontSize: 8,
            width: '10%',
          },

          {
            text: 'Cantitate',
            fontSize: 8,
            width: '10%',
          },

          {
            text: 'Pret unitar',
            fontSize: 8,
            width: '10%',
          },
          {
            text: 'Valoare',
            fontSize: 8,
            width: '10%',
          },
          {
            text: 'TVA (19%)',
            fontSize: 8,
            width: '10%',
          },
        ],
        columnGap: 0,
      },

      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }],
        margin: [0, 2, 0, 10],
      },

      {
        columns: [
          {
            text: '1',
            fontSize: 8,
            width: '10%',
            margin: [0, 0, 0, 0],
          },
          {
            text: 'TRANSPORT INTERN DE MARFA',
            fontSize: 8,
            width: '40%',
            margin: [0, 0, 0, 0],
          },
          {
            text: 'BUC',
            fontSize: 8,
            width: '10%',
          },
          {
            text: `${payment.amount}`,
            fontSize: 8,
            width: '10%',
          },
          {
            text: `${payment.price_unit}`,
            fontSize: 8,
            width: '10%',
          },
          {
            text: `${payment.price_for_amount}`,
            fontSize: 8,
            width: '10%',
          },
          {
            text: `${payment.vat_value}`,
            fontSize: 8,
            width: '10%',
          },
        ],
        columnGap: 0,
      },
      {
        columns: [
          {
            text: '',
            fontSize: 8,
            width: '10%',
            margin: [0, 0, 0, 0],
          },
          {
            text: payment.comment,
            fontSize: 8,
            width: '40%',
            margin: [0, 0, 0, 0],
          },
          {
            text: '',
            fontSize: 8,
            width: '10%',
          },
          {
            text: '',
            fontSize: 8,
            width: '10%',
          },
          {
            text: '',
            fontSize: 8,
            width: '10%',
          },
          {
            text: '',
            fontSize: 8,
            width: '10%',
          },
          {
            text: '',
            fontSize: 8,
            width: '10%',
          },
        ],
        columnGap: 0,
      },
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }],
        margin: [0, 2, 0, 2],
      },
      {
        text: `${company.name.toUpperCase()} NU APLICA NOUL SISTEM DE PLATA DEFALCATA A TVA-ULUI.`,
        fontSize: 8,
      },

      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }],
        margin: [0, 2, 0, 2],
      },

      {
        columns: [
          {
            text: 'Emis de',
            fontSize: 7.5,
            width: '15%',
            margin: [0, 0, 0, 0],
          },
          {
            text: 'Date privind expeditia',
            fontSize: 7.5,
            width: '35%',
            margin: [0, 0, 0, 0],
          },
          {
            text: '',
            fontSize: 1,
            width: '10%',
          },
          {
            text: '',
            fontSize: 8,
            width: '10%',
          },
          {
            text: '',
            fontSize: 8,
            width: '10%',
          },
          {
            text: `${payment.price_for_amount}`,
            fontSize: 8,
            bold: true,
            width: '10%',
          },
          {
            text: payment.vat_value,
            fontSize: 8,
            bold: true,
            width: '10%',
          },
        ],
        columnGap: 0,
        margin: [0, 0, 0, 1],
      },

      {
        columns: [
          {
            text: payment.emission_resource.name,
            fontSize: 7.5,
            width: '15%',
            margin: [0, 0, 0, 0],
          },
          {
            text: `Numele delegatului: ${payment.delegate.name}`,
            fontSize: 7.5,
            width: '*',
            alignment: 'left',
          },
        ],
        columnGap: 0,
      },
      {
        columns: [
          {
            text: `CI: ${payment.emission_resource.id_series}/${payment.emission_resource.id_number}`,
            fontSize: 7.5,
            width: '15%',
            margin: [0, 0, 0, 0],
          },
          {
            text: `C.I. seria:\t${payment.delegate.id_series} nr:\t${payment.delegate.id_number}`,
            fontSize: 7.5,
            width: '*',
            alignment: 'left',
          },
        ],
        columnGap: 0,
      },
      {
        columns: [
          {
            text: ``,
            fontSize: 7.5,
            width: '15%',
            margin: [0, 0, 0, 0],
          },
          {
            text: `Mijlocul de transport: ${payment.car_plate}`,
            fontSize: 7.5,
            width: '*',
            alignment: 'left',
          },
        ],
        columnGap: 0,
      },
      {
        canvas: [
          { type: 'line', x1: 280, y1: 0, x2: 515, y2: 0, lineWidth: 1 },
        ],
        margin: [0, 2, 0, 2],
      },

      {
        columns: [
          {
            text: '',
            fontSize: 7.5,
            width: '10%',
            margin: [0, 0, 0, 0],
          },
          {
            text: '',
            fontSize: 7.5,
            width: '40%',
            margin: [0, 0, 0, 0],
          },
          {
            text: '',
            fontSize: 1,
            width: '10%',
          },
          {
            text: '',
            fontSize: 8,
            width: '10%',
          },
          {
            text: 'Total',
            fontSize: 10,
            bold: true,
          },
          {
            text: '',
            fontSize: 8,
            bold: true,
            width: '10%',
          },
          {
            text: payment.total,
            fontSize: 10,
            bold: true,
          },
        ],
        columnGap: 0,
        margin: [0, 0, 0, 1],
      },

      {
        text: 'FACTURA VALABILA FARA SEMNATURA SI STAMPILA CF. ART.319,ALIN.(29) DIN LEGEA NR. 227/2015 PRIVIND CODUL FISCAL',
        margin: [0, 410, 0, 0],
        fontSize: 8,
        bold: true,
        alignment: 'center',
      },
    ],
  };

  switch (type) {
    case 'view':
      pdfMake.createPdf(docDefinition).open();
      break;
    case 'download':
      pdfMake.createPdf(docDefinition).download();
      break;
  }
}
