import React, { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CategoryService, { ICategory } from '@services/CategoryService';
import Select from '@components/Select';
import DataPicker from '@components/DataPicker';
import { useForm } from 'react-hook-form';
import {
  Container,
  FilterText,
  Icon,
  ButtonContainer,
  FilterContainer,
  FilterButton,
} from './styles';

export interface DataFilter {
  categoriaId?: string;
  dataInicial: Date;
  dataFinal: Date;
  statusEvento?: 'PUBLICADO' | 'CRIADO';
}
interface IFilterModal {
  onHandleFilter: (value: DataFilter | undefined) => void;
}

const FilterModal: React.FC<IFilterModal> = ({ onHandleFilter }) => {
  const statusEvent = [
    {
      id: 'PUBLICADO',
      name: 'Publicado',
    },
    {
      id: 'CRIADO',
      name: 'Criado',
    },
  ];
  const [categories, setCategories] = useState<ICategory[]>([]);
  const schema = Yup.object().shape({
    categoriaId: Yup.string().optional(),
    statusEvento: Yup.string().required('Campo Obrigatório'),
    dataInicial: Yup.date()
      .transform((curr, orig) => (orig === '' ? null : curr))
      .nullable()
      .optional(),
    dataFinal: Yup.date()
      .transform((curr, orig) => (orig === '' ? null : curr))
      .nullable()
      .when('dataInicial', {
        is: (val: any) => !!val,
        then: Yup.date().required('Campo Obrigatório'),
        otherwise: Yup.date()
          .transform((curr, orig) => (orig === '' ? null : curr))
          .nullable()
          .optional(),
      }),
  });
  const formattedCategories = useMemo(() => {
    return categories.map(item => {
      return {
        name: item.nome,
        id: item.id,
      };
    });
  }, [categories]);
  const refRBSheet = React.useRef<any>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      categoriaId: '',
      dataInicial: '',
      dataFinal: '',
    },
  });
  useEffect(() => {
    const getCategoryList = async (): Promise<void> => {
      const serviceCategories = await CategoryService.getCategoryList();

      setCategories(serviceCategories);
    };

    getCategoryList();
  }, []);

  const onSubmit = (data: DataFilter): void => {
    onHandleFilter(data);
    refRBSheet.current.close();
  };

  return (
    <TouchableOpacity onPress={() => refRBSheet.current.open()}>
      <Container>
        <FilterText>Filtro</FilterText>
        <Icon />
        <RBSheet
          ref={refRBSheet}
          height={400}
          openDuration={250}
          closeOnDragDown
          closeOnPressMask={false}
          customStyles={{
            container: {
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            },
          }}
        >
          <FilterContainer>
            <DataPicker
              name="dataInicial"
              errors={errors}
              control={control}
              label="Data Inicial"
            />
            <DataPicker
              name="dataFinal"
              errors={errors}
              control={control}
              label="Data Final"
            />
            <Select
              menuPlaceholder="Status"
              name="statusEvento"
              errors={errors}
              control={control}
              label="Status"
              options={statusEvent}
            />
            <Select
              label="Categorias"
              menuPlaceholder="Categorias"
              name="categoriaId"
              errors={errors}
              control={control}
              options={formattedCategories}
            />
            <ButtonContainer>
              <FilterButton color="#6a2aba" onPress={handleSubmit(onSubmit)}>
                Filtrar
              </FilterButton>
              <FilterButton
                color="#De0b20"
                onPress={() => {
                  refRBSheet.current.close();
                }}
              >
                Cancelar
              </FilterButton>
            </ButtonContainer>
          </FilterContainer>
        </RBSheet>
      </Container>
    </TouchableOpacity>
  );
};

export default FilterModal;
