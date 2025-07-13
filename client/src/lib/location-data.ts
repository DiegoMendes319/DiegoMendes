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
  // 21 Provinces of Angola (2025 Update) - Based on official administrative structure
  luanda: {
    name: 'Luanda',
    municipalities: {
      luanda: {
        name: 'Luanda',
        neighborhoods: [
          'Ingombota', 'Maianga', 'Rangel', 'Samba', 'Sambizanga', 'Angola Quiluanje',
          'Mutamba', 'Maculusso', 'Alvalade', 'Miramar', 'Ilha do Cabo',
          'São Paulo', 'Operário', 'Prenda', 'Cassenda', 'Kinanga',
          'Palanca', 'Rocha Pinto', 'Ctm'
        ]
      },
      belas: {
        name: 'Belas',
        neighborhoods: [
          'Barra do Cuanza', 'Kilamba', 'Benfica', 'Mussulo', 'Ramiros',
          'Futungo de Belas', 'Benfica e Mussulo', 'Quilamba Kiaxi'
        ]
      },
      cacuaco: {
        name: 'Cacuaco',
        neighborhoods: [
          'Cacuaco', 'Funda', 'Quicolo', 'Kikolo', 'Sequele',
          'Cacuaco Sede', 'Funda Centro', 'Quicolo Centro'
        ]
      },
      cazenga: {
        name: 'Cazenga',
        neighborhoods: [
          'Cazenga', 'Hoji Ya Henda', 'Tala Hady', 'Cazenga Popular',
          'Distrito Industrial', 'Cazenga Sede', 'Hoji Ya Henda Centro'
        ]
      },
      quicama: {
        name: 'Quiçama',
        neighborhoods: [
          'Cabo Ledo', 'Demba Chio', 'Mumbondo', 'Muxima', 'Quixinje',
          'Kixinje', 'Cabo Ledo Centro', 'Demba Chio Centro'
        ]
      },
      viana: {
        name: 'Viana',
        neighborhoods: [
          'Calumbo', 'Viana', 'Zango', 'Mbaia', 'Centralidade do Zango',
          'Viana Centro', 'Calumbo Centro', 'Zango I', 'Zango II', 'Zango III'
        ]
      },
      talatona: {
        name: 'Talatona',
        neighborhoods: [
          'Talatona', 'Camama', 'Benfica', 'Futungo de Belas', 'Quificas',
          'Talatona Centro', 'Camama Centro', 'Benfica Centro'
        ]
      }
    }
  },
  icolo_bengo: {
    name: 'Icolo e Bengo',
    municipalities: {
      icolo_bengo: {
        name: 'Icolo e Bengo',
        neighborhoods: ['Icolo e Bengo Centro', 'Bairro Operário', 'Bairro Popular']
      }
    }
  },
  bengo: {
    name: 'Bengo',
    municipalities: {
      caxito: {
        name: 'Caxito',
        neighborhoods: ['Caxito Centro', 'Bairro Operário', 'Bairro Popular']
      },
      ambriz: {
        name: 'Ambriz',
        neighborhoods: ['Ambriz', 'Ambriz Centro']
      },
      dande: {
        name: 'Dande',
        neighborhoods: ['Dande', 'Dande Centro']
      },
      dembos: {
        name: 'Dembos',
        neighborhoods: ['Dembos', 'Dembos Centro']
      },
      nambuangongo: {
        name: 'Nambuangongo',
        neighborhoods: ['Nambuangongo', 'Nambuangongo Centro']
      },
      pango_aluquem: {
        name: 'Pango Aluquem',
        neighborhoods: ['Pango Aluquem', 'Pango Aluquem Centro']
      }
    }
  },
  benguela: {
    name: 'Benguela',
    municipalities: {
      benguela: {
        name: 'Benguela',
        neighborhoods: [
          'Benguela Centro', 'Praia Morena', 'Compão', 'Candemba', 'Catumbela',
          'Benfica', 'Cavaco', 'Canjala', 'Restinga', 'Damba Maria'
        ]
      },
      lobito: {
        name: 'Lobito',
        neighborhoods: [
          'Lobito Centro', 'Restinga', 'Bairro da Restinga', 'Ponta da Restinga',
          'Canjala', 'Egipto Praia', 'Compão', 'Benfica', 'Cavaco'
        ]
      },
      baia_farta: {
        name: 'Baía Farta',
        neighborhoods: [
          'Baía Farta', 'Calohanga', 'Dombe Grande', 'Equimina',
          'Kalohanga', 'Baía Farta Centro'
        ]
      },
      balombo: {
        name: 'Balombo',
        neighborhoods: [
          'Balombo', 'Chindumbo', 'Chingongo', 'Maca Mombolo',
          'Chidumbo', 'Chigongo', 'Balombo Centro'
        ]
      },
      bocoio: {
        name: 'Bocoio',
        neighborhoods: ['Bocoio', 'Cubal', 'Ganda', 'Bocoio Centro']
      },
      caimbambo: {
        name: 'Caimbambo',
        neighborhoods: ['Caimbambo', 'Caimbambo Centro']
      },
      chongoroi: {
        name: 'Chongoroi',
        neighborhoods: ['Chongoroi', 'Chongoroi Centro']
      },
      cubal: {
        name: 'Cubal',
        neighborhoods: ['Cubal', 'Cubal Centro']
      },
      ganda: {
        name: 'Ganda',
        neighborhoods: ['Ganda', 'Ganda Centro']
      },
      ukuma: {
        name: 'Ukuma',
        neighborhoods: ['Ukuma', 'Ukuma Centro']
      }
    }
  },
  huambo: {
    name: 'Huambo',
    municipalities: {
      huambo: {
        name: 'Huambo',
        neighborhoods: [
          'Huambo Centro', 'Kakelewa', 'Calundo', 'Viação', 'Vila Graça',
          'Santa Iria', 'Katchidombe', 'Sassonde I', 'Sassonde II',
          'Santo António', 'Casseque I', 'Casseque II', 'Kapango', 'Aviação'
        ]
      },
      bailundo: {
        name: 'Bailundo',
        neighborhoods: ['Bailundo', 'Bailundo Centro']
      },
      londuimbale: {
        name: 'Londuimbale',
        neighborhoods: ['Londuimbale', 'Londuimbale Centro']
      },
      mungo: {
        name: 'Mungo',
        neighborhoods: ['Mungo', 'Mungo Centro']
      },
      tchindjenje: {
        name: 'Tchindjenje',
        neighborhoods: ['Tchindjenje', 'Tchindjenje Centro']
      },
      ucuma: {
        name: 'Ucuma',
        neighborhoods: ['Ucuma', 'Ucuma Centro']
      },
      ekunha: {
        name: 'Ekunha',
        neighborhoods: ['Ekunha', 'Ekunha Centro']
      },
      tchicala_tcholoanga: {
        name: 'Tchicala-Tcholoanga',
        neighborhoods: ['Tchicala-Tcholoanga', 'Tchicala-Tcholoanga Centro']
      },
      catchiungo: {
        name: 'Catchiungo',
        neighborhoods: ['Catchiungo', 'Catchiungo Centro']
      },
      longonjo: {
        name: 'Longonjo',
        neighborhoods: ['Longonjo', 'Longonjo Centro']
      },
      caala: {
        name: 'Caála',
        neighborhoods: ['Caála', 'Caála Centro']
      }
    }
  },
  cabinda: {
    name: 'Cabinda',
    municipalities: {
      cabinda: {
        name: 'Cabinda',
        neighborhoods: [
          'Cabinda Centro', 'Tchiowa', 'Simulambuco', 'Cabinda Sede',
          'Malembo', 'Cabinda Porto', 'Cabinda Aeroporto'
        ]
      },
      belize: {
        name: 'Belize',
        neighborhoods: ['Belize', 'Belize Centro']
      },
      buco_zau: {
        name: 'Buco-Zau',
        neighborhoods: ['Buco-Zau', 'Buco-Zau Centro']
      },
      cacongo: {
        name: 'Cacongo',
        neighborhoods: ['Cacongo', 'Cacongo Centro']
      }
    }
  },
  bie: {
    name: 'Bié',
    municipalities: {
      kuito: {
        name: 'Kuito',
        neighborhoods: ['Kuito Centro', 'Bairro Operário', 'Bairro Popular', 'Kuito Sede']
      },
      andulo: {
        name: 'Andulo',
        neighborhoods: ['Andulo', 'Andulo Centro']
      },
      camacupa: {
        name: 'Camacupa',
        neighborhoods: ['Camacupa', 'Camacupa Centro']
      },
      catabola: {
        name: 'Catabola',
        neighborhoods: ['Catabola', 'Catabola Centro']
      },
      chinguar: {
        name: 'Chinguar',
        neighborhoods: ['Chinguar', 'Chinguar Centro']
      },
      chitembo: {
        name: 'Chitembo',
        neighborhoods: ['Chitembo', 'Chitembo Centro']
      },
      cunhinga: {
        name: 'Cunhinga',
        neighborhoods: ['Cunhinga', 'Cunhinga Centro']
      },
      nharea: {
        name: 'Nharea',
        neighborhoods: ['Nharea', 'Nharea Centro']
      }
    }
  },
  cuanza_norte: {
    name: 'Cuanza Norte',
    municipalities: {
      ndalatando: {
        name: 'N\'dalatando',
        neighborhoods: ['N\'dalatando Centro', 'Bairro Operário', 'Bairro Popular']
      },
      ambriz: {
        name: 'Ambriz',
        neighborhoods: ['Ambriz', 'Ambriz Centro']
      },
      banga: {
        name: 'Banga',
        neighborhoods: ['Banga', 'Banga Centro']
      },
      bolongongo: {
        name: 'Bolongongo',
        neighborhoods: ['Bolongongo', 'Bolongongo Centro']
      },
      cambambe: {
        name: 'Cambambe',
        neighborhoods: ['Cambambe', 'Cambambe Centro']
      },
      cazengo: {
        name: 'Cazengo',
        neighborhoods: ['Cazengo', 'Cazengo Centro']
      },
      dange_quitexe: {
        name: 'Dange-Quitexe',
        neighborhoods: ['Dange-Quitexe', 'Dange-Quitexe Centro']
      },
      lucala: {
        name: 'Lucala',
        neighborhoods: ['Lucala', 'Lucala Centro']
      },
      quiculungo: {
        name: 'Quiculungo',
        neighborhoods: ['Quiculungo', 'Quiculungo Centro']
      },
      samba_caju: {
        name: 'Samba Caju',
        neighborhoods: ['Samba Caju', 'Samba Caju Centro']
      }
    }
  },
  cuanza_sul: {
    name: 'Cuanza Sul',
    municipalities: {
      sumbe: {
        name: 'Sumbe',
        neighborhoods: ['Sumbe Centro', 'Bairro Operário', 'Bairro Popular']
      },
      amboim: {
        name: 'Amboim',
        neighborhoods: ['Amboim', 'Amboim Centro']
      },
      cassongue: {
        name: 'Cassongue',
        neighborhoods: ['Cassongue', 'Cassongue Centro']
      },
      conda: {
        name: 'Conda',
        neighborhoods: ['Conda', 'Conda Centro']
      },
      ebo: {
        name: 'Ebo',
        neighborhoods: ['Ebo', 'Ebo Centro']
      },
      libolo: {
        name: 'Libolo',
        neighborhoods: ['Libolo', 'Libolo Centro']
      },
      mussende: {
        name: 'Mussende',
        neighborhoods: ['Mussende', 'Mussende Centro']
      },
      porto_amboim: {
        name: 'Porto Amboim',
        neighborhoods: ['Porto Amboim', 'Porto Amboim Centro']
      },
      quibala: {
        name: 'Quibala',
        neighborhoods: ['Quibala', 'Quibala Centro']
      },
      quilenda: {
        name: 'Quilenda',
        neighborhoods: ['Quilenda', 'Quilenda Centro']
      },
      seles: {
        name: 'Seles',
        neighborhoods: ['Seles', 'Seles Centro']
      },
      waku_kungo: {
        name: 'Waku-Kungo',
        neighborhoods: ['Waku-Kungo', 'Waku-Kungo Centro']
      }
    }
  },
  cunene: {
    name: 'Cunene',
    municipalities: {
      ondjiva: {
        name: 'Ondjiva',
        neighborhoods: [
          'Ondjiva Centro', 'Bairro 1', 'Bairro 2', 'Bairro 3', 'Bairro 4',
          'Bairro 5', 'Bairro 6', 'Bairro 7', 'Bairro 8', 'Bairro 9',
          'Bairro 10', 'Bairro 11', 'Bairro 12'
        ]
      },
      cahama: {
        name: 'Cahama',
        neighborhoods: ['Cahama', 'Cahama Centro']
      },
      cuanhama: {
        name: 'Cuanhama',
        neighborhoods: ['Cuanhama', 'Cuanhama Centro']
      },
      curoca: {
        name: 'Curoca',
        neighborhoods: ['Curoca', 'Curoca Centro']
      },
      namacunde: {
        name: 'Namacunde',
        neighborhoods: ['Namacunde', 'Namacunde Centro']
      },
      ombadja: {
        name: 'Ombadja',
        neighborhoods: ['Ombadja', 'Ombadja Centro']
      }
    }
  },
  huila: {
    name: 'Huíla',
    municipalities: {
      lubango: {
        name: 'Lubango',
        neighborhoods: [
          'Lubango Centro', 'Comercial', 'Mutundo', 'Bairro Operário',
          'Bairro Popular', 'Bairro Comercial', 'Bairro do Boa Vida'
        ]
      },
      caconda: {
        name: 'Caconda',
        neighborhoods: ['Caconda', 'Caconda Centro']
      },
      cacula: {
        name: 'Cacula',
        neighborhoods: ['Cacula', 'Cacula Centro']
      },
      caluquembe: {
        name: 'Caluquembe',
        neighborhoods: ['Caluquembe', 'Caluquembe Centro']
      },
      chiange: {
        name: 'Chiange',
        neighborhoods: ['Chiange', 'Chiange Centro']
      },
      chibia: {
        name: 'Chibia',
        neighborhoods: ['Chibia', 'Chibia Centro']
      },
      chipindo: {
        name: 'Chipindo',
        neighborhoods: ['Chipindo', 'Chipindo Centro']
      },
      cuvango: {
        name: 'Cuvango',
        neighborhoods: ['Cuvango', 'Cuvango Centro']
      },
      humpata: {
        name: 'Humpata',
        neighborhoods: ['Humpata', 'Humpata Centro']
      },
      jamba: {
        name: 'Jamba',
        neighborhoods: ['Jamba', 'Jamba Centro']
      },
      matala: {
        name: 'Matala',
        neighborhoods: ['Matala', 'Matala Centro']
      },
      mucuma: {
        name: 'Mucuma',
        neighborhoods: ['Mucuma', 'Mucuma Centro']
      },
      quipungo: {
        name: 'Quipungo',
        neighborhoods: ['Quipungo', 'Quipungo Centro']
      },
      quilengues: {
        name: 'Quilengues',
        neighborhoods: ['Quilengues', 'Quilengues Centro']
      }
    }
  },
  lunda_norte: {
    name: 'Lunda Norte',
    municipalities: {
      dundo: {
        name: 'Dundo',
        neighborhoods: ['Dundo Centro', 'Bairro Operário', 'Bairro Popular']
      },
      cambulo: {
        name: 'Cambulo',
        neighborhoods: ['Cambulo', 'Cambulo Centro']
      },
      capenda_camulemba: {
        name: 'Capenda-Camulemba',
        neighborhoods: ['Capenda-Camulemba', 'Capenda-Camulemba Centro']
      },
      caungula: {
        name: 'Caungula',
        neighborhoods: ['Caungula', 'Caungula Centro']
      },
      chitato: {
        name: 'Chitato',
        neighborhoods: ['Chitato', 'Chitato Centro']
      },
      cuango: {
        name: 'Cuango',
        neighborhoods: ['Cuango', 'Cuango Centro']
      },
      cuilo: {
        name: 'Cuilo',
        neighborhoods: ['Cuilo', 'Cuilo Centro']
      },
      lubalo: {
        name: 'Lubalo',
        neighborhoods: ['Lubalo', 'Lubalo Centro']
      },
      xinge: {
        name: 'Xinge',
        neighborhoods: ['Xinge', 'Xinge Centro']
      }
    }
  },
  lunda_sul: {
    name: 'Lunda Sul',
    municipalities: {
      saurimo: {
        name: 'Saurimo',
        neighborhoods: ['Saurimo Centro', 'Bairro Operário', 'Bairro Popular']
      },
      cacolo: {
        name: 'Cacolo',
        neighborhoods: ['Cacolo', 'Cacolo Centro']
      },
      dala: {
        name: 'Dala',
        neighborhoods: ['Dala', 'Dala Centro']
      },
      muconda: {
        name: 'Muconda',
        neighborhoods: ['Muconda', 'Muconda Centro']
      }
    }
  },
  malanje: {
    name: 'Malanje',
    municipalities: {
      malanje: {
        name: 'Malanje',
        neighborhoods: ['Malanje Centro', 'Bairro Operário', 'Bairro Popular']
      },
      cacuso: {
        name: 'Cacuso',
        neighborhoods: ['Cacuso', 'Cacuso Centro']
      },
      calandula: {
        name: 'Calandula',
        neighborhoods: ['Calandula', 'Calandula Centro']
      },
      cambundi_catembo: {
        name: 'Cambundi-Catembo',
        neighborhoods: ['Cambundi-Catembo', 'Cambundi-Catembo Centro']
      },
      cangandala: {
        name: 'Cangandala',
        neighborhoods: ['Cangandala', 'Cangandala Centro']
      },
      caombo: {
        name: 'Caombo',
        neighborhoods: ['Caombo', 'Caombo Centro']
      },
      cuaba_nzoji: {
        name: 'Cuaba-Nzoji',
        neighborhoods: ['Cuaba-Nzoji', 'Cuaba-Nzoji Centro']
      },
      cunda_dia_baze: {
        name: 'Cunda-Dia-Baze',
        neighborhoods: ['Cunda-Dia-Baze', 'Cunda-Dia-Baze Centro']
      },
      kiwaba_nzoji: {
        name: 'Kiwaba-Nzoji',
        neighborhoods: ['Kiwaba-Nzoji', 'Kiwaba-Nzoji Centro']
      },
      luquembo: {
        name: 'Luquembo',
        neighborhoods: ['Luquembo', 'Luquembo Centro']
      },
      marimba: {
        name: 'Marimba',
        neighborhoods: ['Marimba', 'Marimba Centro']
      },
      massango: {
        name: 'Massango',
        neighborhoods: ['Massango', 'Massango Centro']
      },
      mucari: {
        name: 'Mucari',
        neighborhoods: ['Mucari', 'Mucari Centro']
      },
      quela: {
        name: 'Quela',
        neighborhoods: ['Quela', 'Quela Centro']
      }
    }
  },
  moxico: {
    name: 'Moxico',
    municipalities: {
      luena: {
        name: 'Luena',
        neighborhoods: ['Luena Centro', 'Bairro Operário', 'Bairro Popular']
      },
      alto_zambeze: {
        name: 'Alto Zambeze',
        neighborhoods: ['Alto Zambeze', 'Alto Zambeze Centro']
      },
      bundas: {
        name: 'Bundas',
        neighborhoods: ['Bundas', 'Bundas Centro']
      },
      camanongue: {
        name: 'Camanongue',
        neighborhoods: ['Camanongue', 'Camanongue Centro']
      },
      cameia: {
        name: 'Cameia',
        neighborhoods: ['Cameia', 'Cameia Centro']
      },
      leua: {
        name: 'Leua',
        neighborhoods: ['Leua', 'Leua Centro']
      },
      luacano: {
        name: 'Luacano',
        neighborhoods: ['Luacano', 'Luacano Centro']
      },
      luchazes: {
        name: 'Luchazes',
        neighborhoods: ['Luchazes', 'Luchazes Centro']
      },
      moxico: {
        name: 'Moxico',
        neighborhoods: ['Moxico', 'Moxico Centro']
      }
    }
  },
  namibe: {
    name: 'Namibe',
    municipalities: {
      mocamedes: {
        name: 'Moçâmedes',
        neighborhoods: ['Moçâmedes Centro', 'Bairro Operário', 'Bairro Popular']
      },
      bibala: {
        name: 'Bibala',
        neighborhoods: ['Bibala', 'Bibala Centro']
      },
      camucuio: {
        name: 'Camucuio',
        neighborhoods: ['Camucuio', 'Camucuio Centro']
      },
      tombe: {
        name: 'Tombe',
        neighborhoods: ['Tombe', 'Tombe Centro']
      },
      virei: {
        name: 'Virei',
        neighborhoods: ['Virei', 'Virei Centro']
      }
    }
  },
  uige: {
    name: 'Uíge',
    municipalities: {
      uige: {
        name: 'Uíge',
        neighborhoods: ['Uíge Centro', 'Bairro Operário', 'Bairro Popular']
      },
      alto_cauale: {
        name: 'Alto Cauale',
        neighborhoods: ['Alto Cauale', 'Alto Cauale Centro']
      },
      ambuila: {
        name: 'Ambuila',
        neighborhoods: ['Ambuila', 'Ambuila Centro']
      },
      bembe: {
        name: 'Bembe',
        neighborhoods: ['Bembe', 'Bembe Centro']
      },
      buengas: {
        name: 'Buengas',
        neighborhoods: ['Buengas', 'Buengas Centro']
      },
      bungo: {
        name: 'Bungo',
        neighborhoods: ['Bungo', 'Bungo Centro']
      },
      damba: {
        name: 'Damba',
        neighborhoods: ['Damba', 'Damba Centro']
      },
      milunga: {
        name: 'Milunga',
        neighborhoods: ['Milunga', 'Milunga Centro']
      },
      mucaba: {
        name: 'Mucaba',
        neighborhoods: ['Mucaba', 'Mucaba Centro']
      },
      negage: {
        name: 'Negage',
        neighborhoods: ['Negage', 'Negage Centro']
      },
      puri: {
        name: 'Puri',
        neighborhoods: ['Puri', 'Puri Centro']
      },
      quitexe: {
        name: 'Quitexe',
        neighborhoods: ['Quitexe', 'Quitexe Centro']
      },
      sanza_pombo: {
        name: 'Sanza Pombo',
        neighborhoods: ['Sanza Pombo', 'Sanza Pombo Centro']
      },
      songo: {
        name: 'Songo',
        neighborhoods: ['Songo', 'Songo Centro']
      },
      zombo: {
        name: 'Zombo',
        neighborhoods: ['Zombo', 'Zombo Centro']
      }
    }
  },
  zaire: {
    name: 'Zaire',
    municipalities: {
      mbanza_kongo: {
        name: 'Mbanza Kongo',
        neighborhoods: ['Mbanza Kongo Centro', 'Bairro Operário', 'Bairro Popular']
      },
      cuimba: {
        name: 'Cuimba',
        neighborhoods: ['Cuimba', 'Cuimba Centro']
      },
      noqui: {
        name: 'Nóqui',
        neighborhoods: ['Nóqui', 'Nóqui Centro']
      },
      nsoso: {
        name: 'Nsoso',
        neighborhoods: ['Nsoso', 'Nsoso Centro']
      },
      soyo: {
        name: 'Soyo',
        neighborhoods: ['Soyo', 'Soyo Centro']
      },
      tomboco: {
        name: 'Tomboco',
        neighborhoods: ['Tomboco', 'Tomboco Centro']
      }
    }
  },
  // Novas províncias criadas em 2024
  cuando: {
    name: 'Cuando',
    municipalities: {
      cuando: {
        name: 'Cuando',
        neighborhoods: ['Cuando Centro', 'Bairro Operário', 'Bairro Popular']
      }
    }
  },
  cubango: {
    name: 'Cubango',
    municipalities: {
      cubango: {
        name: 'Cubango',
        neighborhoods: ['Cubango Centro', 'Bairro Operário', 'Bairro Popular']
      }
    }
  }
};