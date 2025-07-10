export interface LocationData {
  [province: string]: {
    name: string;
    municipalities: {
      [municipality: string]: {
        name: string;
        neighborhoods: string[];
      };
    };
  };
}

export const locationData: LocationData = {
  luanda: {
    name: 'Luanda',
    municipalities: {
      ingombota: {
        name: 'Ingombota',
        neighborhoods: ['Maianga', 'Alvalade', 'Miramar', 'Patrice Lumumba']
      },
      maianga: {
        name: 'Maianga',
        neighborhoods: ['Kinanga', 'Prenda', 'Rangel', 'Operário']
      },
      samba: {
        name: 'Samba',
        neighborhoods: ['Sambizanga', 'Operário', 'Ngola Kiluange', 'Cazenga']
      },
      kilamba_kiaxi: {
        name: 'Kilamba Kiaxi',
        neighborhoods: ['Kilamba', 'Golf', 'Camama', 'Benfica']
      }
    }
  },
  benguela: {
    name: 'Benguela',
    municipalities: {
      benguela: {
        name: 'Benguela',
        neighborhoods: ['Centro', 'Praia Morena', 'Compão', 'Caponte']
      },
      lobito: {
        name: 'Lobito',
        neighborhoods: ['Canata', 'Compão', 'Restinga', 'Caponte']
      }
    }
  },
  huambo: {
    name: 'Huambo',
    municipalities: {
      huambo: {
        name: 'Huambo',
        neighborhoods: ['Centro', 'Comala', 'Comercial', 'Tchioco']
      }
    }
  },
  huila: {
    name: 'Huíla',
    municipalities: {
      lubango: {
        name: 'Lubango',
        neighborhoods: ['Centro', 'Comercial', 'Tchidia', 'Arimba']
      }
    }
  },
  uige: {
    name: 'Uíge',
    municipalities: {
      uige: {
        name: 'Uíge',
        neighborhoods: ['Centro', 'Kimongo', 'Sagrada Família', 'Negage']
      }
    }
  }
};
