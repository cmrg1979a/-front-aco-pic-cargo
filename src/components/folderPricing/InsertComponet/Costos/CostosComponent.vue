<template>
  <v-container fluid>
    <div class="">
      <v-row>
        <v-col cols="4">
          <span class="title">
            Costos {{ currencyFormat($store.state.pricing.totalCosto) }}
            <v-btn
              icon
              color="primary"
              @click="abrirModal"
              v-if="!$store.state.pricing.llenadoCostos"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </span>
        </v-col>
        <v-col cols="8">
          <v-alert
            dense
            type="info"
            outlined
            v-if="
              $store.state.pricing.llenadoCostos &&
              !$store.state.pricing.mostrarGuardarCostos
            "
          >
            El botón para agregar costos adicionales se habilitará luego de
            haber agregado todas las secciones de costos por defecto del
            sistema.
          </v-alert>
        </v-col>
      </v-row>
    </div>
    <v-dialog v-model="dialog" persistent max-width="30%">
      <v-form ref="frmNuevoCosto">
        <v-card>
          <v-card-title primary-title> Nuevo Costo </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  dense
                  autocomplete="none"
                  :items="$store.state.pricing.listTipoCostos"
                  label="Tipo"
                  item-value="codigo"
                  item-text="name"
                  v-model="fromDataService.idOpcion"
                  :rules="[(v) => !!v || 'Dato requerido']"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  dense
                  label="Proveedor"
                  item-text="namelong"
                  item-value="id"
                  :items="$store.state.provedores"
                  v-model="fromDataService.id_proveedor"
                  :rules="[(v) => !!v || 'Dato requerido']"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  dense
                  label="Multiplicador"
                  :items="$store.state.pricing.listMultiplicador"
                  v-model="fromDataService.id_multiplicador"
                  :rules="[(v) => !!v || 'Dato requerido']"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  dense
                  label="Concepto"
                  :rules="[(v) => !!v || 'Dato requerido']"
                  v-model="fromDataService.nameservice"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  dense
                  label="Precio"
                  type="number"
                  min="0"
                  :rules="[(v) => !!v || 'Dato requerido']"
                  v-model="fromDataService.costounitario"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn color="success" @click="guardarCosto()">Aceptar</v-btn>
            <v-btn color="red" @click="dialog = !dialog" dark>cancelar</v-btn>
            <v-spacer></v-spacer>
            <v-alert
              outlined
              type="warning"
              prominent
              border="left"
              class="ml-10"
              dense
            >
              El concepto se verá reflejado al abrir la sección correspondiente.
            </v-alert>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog v-model="dialogNuevoProveedor" persistent max-width="80%">
      <v-card>
        <v-card-title primary-title>
          Ficha de Proveedores <v-spacer></v-spacer>
          <v-btn
            icon
            color="red"
            @click="dialogNuevoProveedor = !dialogNuevoProveedor"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <NuevoProveedorComponentVue
            :isPricing="true"
            v-show="dialogNuevoProveedor"
            @GuardarProveedorExiste="guardarProveedorE"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="success"
            v-if="mostrarBtnRegistroProveedor()"
            @click="nuevoProveedor()"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div id="FleteImport" v-if="mostrarFleteImport()">
      <v-row>
        <v-col cols="12">
          <v-expansion-panels class="condensed" v-model="valueFleteImport">
            <v-expansion-panel>
              <v-expansion-panel-header>
                {{
                  $store.state.pricing.listTipoCostos.length > 0
                    ? $store.state.pricing.listTipoCostos.filter(
                        (v) => v.codigo == "FL"
                      )[0].name
                    : ""
                }}:

                <span>{{ currencyFormat(resumenOpcion.flete) }} </span>

                <v-icon
                  color="red"
                  v-if="
                    mostrarAdvertencia(
                      valores.filter((v) => v.esfleteflag == 1)
                    )
                  "
                >
                  mdi-alert-circle
                </v-icon>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-simple-table dense>
                  <thead>
                    <tr>
                      <th></th>
                      <th style="">Proveedor</th>
                      <th style="">Conceptos</th>
                      <th style="">Multipicador</th>
                      <th class="derecha" style="">Costo Unitario</th>
                      <th style="">Sub Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="(valor, i) in valores.filter(
                        (v) => v.esfleteflag == 1 && v.status == 1
                      )"
                      :key="i"
                    >
                      <td class="btnAccion">
                        <v-btn
                          icon
                          color="red"
                          x-small
                          @click="eliminarCostos({ costo: valor })"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </td>
                      <td class="colProveedorMultiplicador">
                        <v-autocomplete
                          dense
                          item-text="namelong"
                          item-value="id"
                          :items="$store.state.provedores"
                          v-model="valor.id_proveedor"
                          hide-details
                          append-icon="mdi-plus"
                          @click:append="abrirModalRegistroProveedor(valor)"
                        ></v-autocomplete>
                      </td>
                      <td class="colConcepto">
                        <v-text-field
                          dense
                          hide-details
                          v-model="valor.nameservice"
                        ></v-text-field>
                      </td>
                      <td class="colProveedorMultiplicador">
                        <v-select
                          class="widthTD"
                          :items="$store.state.pricing.listMultiplicador"
                          v-model="valor.id_multiplicador"
                          placeholder="Multiplicador"
                          hide-details
                          dense
                          @change="calcTotales"
                          :readonly="
                            isITBM(valor.code_cost) ||
                            isConfeccion(valor.code_cost) ||
                            isNotaCredito(valor.code_cost)
                          "
                        ></v-select>
                      </td>

                      <td class="colCostos">
                        <v-text-field
                          class="derecha tdMontos"
                          v-if="
                            isNotPorcentaje(valor, valor.id_multiplicador) &&
                            !isConfeccion(valor.code_cost) &&
                            !isITBM(valor.code_cost) &&
                            !isNotaCredito(valor.code_cost)
                          "
                          dense
                          max-width="50%"
                          v-model="valor.costounitario"
                          :error-messages="valor.error"
                          :rules="[
                            (v) => {
                              if (v > 0) {
                                valor.error = ''; // Borra el mensaje de error si el valor es válido
                                return true; // La regla se cumple
                              }
                              valor.error = 'El costo que tiene un valor 0.00.';
                              return false; // La regla no se cumple
                            },
                          ]"
                          prefix="$"
                          type="number"
                          step="0.01"
                          :min="valor.minimo"
                          v-on:blur="calcTotales"
                        ></v-text-field>
                        <v-text-field
                          class="derecha tdMontos"
                          v-if="
                            $store.state.pricing.listMultiplicador.some(
                              (v) =>
                                v.id == valor.id_multiplicador &&
                                (v.code == 13 || v.code == 14)
                            ) &&
                            !isITBM(valor.code_cost) &&
                            !isConfeccion(valor.code_cost) &&
                            !isNotaCredito(valor.code_cost)
                          "
                          hide-details
                          max-width="50%"
                          suffix="%"
                          dense
                          max="100"
                          v-model="valor.cif"
                          type="number"
                          :min="valor.minimo"
                          step="0.01"
                          v-on:blur="calcTotales"
                        ></v-text-field>
                        <v-text-field
                          max-width="50%"
                          suffix="%"
                          class="derecha tdMontos"
                          v-if="
                            $store.state.pricing.listMultiplicador.some(
                              (v) =>
                                v.id == valor.id_multiplicador && v.code == 5
                            ) &&
                            !isITBM(valor.code_cost) &&
                            !isConfeccion(valor.code_cost) &&
                            !isNotaCredito(valor.code_cost)
                          "
                          hide-details
                          dense
                          max="100"
                          v-model="valor.seguro"
                          type="number"
                          :min="valor.minimo"
                          step="0.01"
                          v-on:blur="calcTotales"
                        ></v-text-field>

                        <v-text-field
                          v-if="isITBM(valor.code_cost)"
                          readonly
                          dense
                          v-model="valor.costounitario"
                          :error-messages="valor.error"
                          prefix="$"
                        ></v-text-field>

                        <v-text-field
                          v-if="isConfeccion(valor.code_cost)"
                          readonly
                          dense
                          v-model="valor.costounitario"
                          :error-messages="valor.error"
                          prefix="$"
                        ></v-text-field>
                        <v-text-field
                          v-if="isNotaCredito(valor.code_cost)"
                          readonly
                          dense
                          v-model="valor.costounitario"
                          prefix="$"
                        ></v-text-field>
                      </td>

                      <td
                        class="colCostos"
                        v-if="
                          isNotPorcentaje(valor, valor.id_multiplicador) &&
                          !isConfeccion(valor.code_cost) &&
                          !isITBM(valor.code_cost) &&
                          !isNotaCredito(valor.code_cost)
                        "
                      >
                        {{
                          currencyFormat(
                            ($store.state.pricing.listMultiplicador.filter(
                              (v) => v.id == valor.id_multiplicador
                            ).length > 0
                              ? $store.state.pricing.listMultiplicador.filter(
                                  (v) => v.id == valor.id_multiplicador
                                )[0].valor
                              : 0) *
                              valor.costounitario *
                              calcularFac(
                                $store.state.pricing.listMultiplicador.filter(
                                  (v) => v.id == valor.id_multiplicador
                                ).length > 0
                                  ? $store.state.pricing.listMultiplicador.filter(
                                      (v) => v.id == valor.id_multiplicador
                                    )[0].code
                                  : "N",
                                $store.state.pricing.datosPrincipales.volumen,
                                $store.state.pricing.datosPrincipales.peso,
                                $store.state.pricing.datosPrincipales
                                  .containers,
                                $store.state.pricing.datosPrincipales.amount
                              )
                          )
                        }}
                      </td>

                      <td
                        class="colCostos"
                        v-if="
                          !isNotPorcentaje(valor, valor.id_multiplicador) &&
                          !isITBM(valor.code_cost) &&
                          !isConfeccion(valor.code_cost) &&
                          !isNotaCredito(valor.code_cost)
                        "
                      >
                        {{
                          currencyFormat(
                            calcularValor(
                              $store.state.pricing.datosPrincipales.amount,
                              $store.state.pricing.totalFlete,
                              $store.state.pricing.listMultiplicador.filter(
                                (v) => v.id == valor.id_multiplicador
                              ).length > 0
                                ? $store.state.pricing.listMultiplicador.filter(
                                    (v) => v.id == valor.id_multiplicador
                                  )[0].code
                                : "",
                              $store.state.pricing.listMultiplicador.some(
                                (v) =>
                                  v.id == valor.id_multiplicador &&
                                  (v.code == 14 || v.code == 13 || v.code == 5)
                              )
                                ? $store.state.pricing.listMultiplicador.some(
                                    (v) =>
                                      v.id == valor.id_multiplicador &&
                                      (v.code == 14 || v.code == 13)
                                  )
                                  ? valor.cif
                                  : valor.seguro
                                : 0
                            )
                          )
                        }}
                      </td>
                      <td
                        class="colCostos"
                        v-if="isConfeccion(valor.code_cost)"
                      >
                        {{ montoConfeccion(valor) }}
                      </td>
                      <td class="colCostos" v-if="isITBM(valor.code_cost)">
                        {{ montoITBM(valor) }}
                      </td>

                      <td
                        class="colCostos"
                        v-if="isNotaCredito(valor.code_cost)"
                      >
                        {{ montoNotaCredito(valor) }}
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col class="derecha" v-if="mostrarBtnFleteImportFlag">
          <v-btn color="success" @click="comprobarFleteImport()"
            >Ver siguientes costos</v-btn
          >
        </v-col>
      </v-row>
    </div>
    <div id="Origen" v-if="mostrarOrigen()">
      <v-row>
        <v-col cols="12">
          <v-expansion-panels class="condensed" v-model="valueOrigen">
            <v-expansion-panel>
              <v-expansion-panel-header>
                {{
                  $store.state.pricing.listTipoCostos.length > 0
                    ? $store.state.pricing.listTipoCostos.filter(
                        (v) => v.codigo == "OR"
                      )[0].name
                    : ""
                }}:
                <span>{{ currencyFormat(resumenOpcion.origen) }}</span>

                <v-icon
                  color="red"
                  v-if="
                    mostrarAdvertencia(
                      valores.filter((v) => v.esorigenflag == 1)
                    )
                  "
                >
                  mdi-alert-circle
                </v-icon>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-simple-table dense>
                  <thead>
                    <tr>
                      <th></th>
                      <th style="">Proveedor</th>
                      <th style="">Conceptos</th>
                      <th style="">Multipicador</th>
                      <th class="derecha" style="">Costo Unitario</th>
                      <th style="">Sub Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="(valor, i) in valores.filter(
                        (v) => v.esorigenflag == 1 && v.status == 1
                      )"
                      :key="i"
                    >
                      <td class="btnAccion">
                        <v-btn
                          icon
                          color="red"
                          x-small
                          @click="eliminarCostos({ costo: valor })"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </td>
                      <td class="colProveedorMultiplicador">
                        <v-autocomplete
                          dense
                          item-text="namelong"
                          item-value="id"
                          :items="$store.state.provedores"
                          v-model="valor.id_proveedor"
                          append-icon="mdi-plus"
                          @click:append="abrirModalRegistroProveedor(valor)"
                          hide-details
                        ></v-autocomplete>
                      </td>
                      <td class="colConcepto">
                        <v-text-field
                          dense
                          hide-details
                          v-model="valor.nameservice"
                        ></v-text-field>
                      </td>
                      <td class="colProveedorMultiplicador">
                        <v-select
                          class="widthTD"
                          :items="$store.state.pricing.listMultiplicador"
                          v-model="valor.id_multiplicador"
                          placeholder="Multiplicador"
                          hide-details
                          dense
                          @change="calcTotales"
                          :readonly="
                            isITBM(valor.code_cost) ||
                            isConfeccion(valor.code_cost) ||
                            isNotaCredito(valor.code_cost)
                          "
                        ></v-select>
                      </td>

                      <td class="colCostos">
                        <v-text-field
                          class="derecha tdMontos"
                          v-if="
                            isNotPorcentaje(valor, valor.id_multiplicador) &&
                            !isConfeccion(valor.code_cost) &&
                            !isITBM(valor.code_cost) &&
                            !isNotaCredito(valor.code_cost)
                          "
                          dense
                          max-width="50%"
                          v-model="valor.costounitario"
                          :error-messages="valor.error"
                          :rules="[
                            (v) => {
                              if (v > 0) {
                                valor.error = ''; // Borra el mensaje de error si el valor es válido
                                return true; // La regla se cumple
                              }
                              valor.error = 'El costo que tiene un valor 0.00.';
                              return false; // La regla no se cumple
                            },
                          ]"
                          prefix="$"
                          type="number"
                          step="0.01"
                          :min="valor.minimo"
                          v-on:blur="calcTotales"
                        ></v-text-field>
                        <v-text-field
                          class="derecha tdMontos"
                          v-if="
                            $store.state.pricing.listMultiplicador.some(
                              (v) =>
                                v.id == valor.id_multiplicador &&
                                (v.code == 13 || v.code == 14)
                            ) &&
                            !isITBM(valor.code_cost) &&
                            !isConfeccion(valor.code_cost) &&
                            !isNotaCredito(valor.code_cost)
                          "
                          hide-details
                          max-width="50%"
                          suffix="%"
                          dense
                          max="100"
                          v-model="valor.cif"
                          type="number"
                          :min="valor.minimo"
                          step="0.01"
                          v-on:blur="calcTotales"
                        ></v-text-field>
                        <v-text-field
                          max-width="50%"
                          suffix="%"
                          class="derecha tdMontos"
                          v-if="
                            $store.state.pricing.listMultiplicador.some(
                              (v) =>
                                v.id == valor.id_multiplicador && v.code == 5
                            ) &&
                            !isITBM(valor.code_cost) &&
                            !isConfeccion(valor.code_cost) &&
                            !isNotaCredito(valor.code_cost)
                          "
                          hide-details
                          dense
                          max="100"
                          v-model="valor.seguro"
                          type="number"
                          :min="valor.minimo"
                          step="0.01"
                          v-on:blur="calcTotales"
                        ></v-text-field>

                        <v-text-field
                          v-if="isITBM(valor.code_cost)"
                          readonly
                          dense
                          v-model="valor.costounitario"
                          :error-messages="valor.error"
                          prefix="$"
                        ></v-text-field>

                        <v-text-field
                          v-if="isConfeccion(valor.code_cost)"
                          readonly
                          dense
                          v-model="valor.costounitario"
                          :error-messages="valor.error"
                          prefix="$"
                        ></v-text-field>
                        <v-text-field
                          v-if="isNotaCredito(valor.code_cost)"
                          readonly
                          dense
                          v-model="valor.costounitario"
                          prefix="$"
                        ></v-text-field>
                      </td>

                      <td
                        class="colCostos"
                        v-if="
                          isNotPorcentaje(valor, valor.id_multiplicador) &&
                          !isConfeccion(valor.code_cost) &&
                          !isITBM(valor.code_cost) &&
                          !isNotaCredito(valor.code_cost)
                        "
                      >
                        {{
                          currencyFormat(
                            ($store.state.pricing.listMultiplicador.filter(
                              (v) => v.id == valor.id_multiplicador
                            ).length > 0
                              ? $store.state.pricing.listMultiplicador.filter(
                                  (v) => v.id == valor.id_multiplicador
                                )[0].valor
                              : 0) *
                              valor.costounitario *
                              calcularFac(
                                $store.state.pricing.listMultiplicador.filter(
                                  (v) => v.id == valor.id_multiplicador
                                ).length > 0
                                  ? $store.state.pricing.listMultiplicador.filter(
                                      (v) => v.id == valor.id_multiplicador
                                    )[0].code
                                  : "N",
                                $store.state.pricing.datosPrincipales.volumen,
                                $store.state.pricing.datosPrincipales.peso,
                                $store.state.pricing.datosPrincipales
                                  .containers,
                                $store.state.pricing.datosPrincipales.amount
                              )
                          )
                        }}
                      </td>

                      <td
                        class="colCostos"
                        v-if="
                          !isNotPorcentaje(valor, valor.id_multiplicador) &&
                          !isITBM(valor.code_cost) &&
                          !isConfeccion(valor.code_cost) &&
                          !isNotaCredito(valor.code_cost)
                        "
                      >
                        {{
                          currencyFormat(
                            calcularValor(
                              $store.state.pricing.datosPrincipales.amount,
                              $store.state.pricing.totalFlete,
                              $store.state.pricing.listMultiplicador.filter(
                                (v) => v.id == valor.id_multiplicador
                              ).length > 0
                                ? $store.state.pricing.listMultiplicador.filter(
                                    (v) => v.id == valor.id_multiplicador
                                  )[0].code
                                : "",
                              $store.state.pricing.listMultiplicador.some(
                                (v) =>
                                  v.id == valor.id_multiplicador &&
                                  (v.code == 14 || v.code == 13 || v.code == 5)
                              )
                                ? $store.state.pricing.listMultiplicador.some(
                                    (v) =>
                                      v.id == valor.id_multiplicador &&
                                      (v.code == 14 || v.code == 13)
                                  )
                                  ? valor.cif
                                  : valor.seguro
                                : 0
                            )
                          )
                        }}
                      </td>
                      <td
                        class="colCostos"
                        v-if="isConfeccion(valor.code_cost)"
                      >
                        {{ montoConfeccion(valor) }}
                      </td>
                      <td class="colCostos" v-if="isITBM(valor.code_cost)">
                        {{ montoITBM(valor) }}
                      </td>

                      <td
                        class="colCostos"
                        v-if="isNotaCredito(valor.code_cost)"
                      >
                        {{ montoNotaCredito(valor) }}
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col class="derecha" v-if="mostrarBtnOrigenFlag">
          <v-btn color="success" @click="comprobarOrigen()"
            >Ver siguientes costos</v-btn
          >
        </v-col>
      </v-row>
    </div>

    <div id="Local" v-if="mostrarLocal()">
      <v-row>
        <v-col cols="12">
          <v-expansion-panels class="condensed" v-model="valueLocal">
            <v-expansion-panel>
              <v-expansion-panel-header>
                {{
                  $store.state.pricing.listTipoCostos.length > 0
                    ? $store.state.pricing.listTipoCostos.filter(
                        (v) => v.codigo == "LO"
                      )[0].name
                    : ""
                }}:
                <span>{{ currencyFormat(resumenOpcion.gasto) }}</span>
                <v-icon
                  color="red"
                  v-if="
                    mostrarAdvertencia(
                      valores.filter((v) => v.eslocalflag == 1)
                    )
                  "
                >
                  mdi-alert-circle
                </v-icon>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-simple-table dense>
                  <thead>
                    <tr>
                      <th></th>
                      <th style="">Proveedor</th>
                      <th style="">Conceptos</th>
                      <th style="">Multipicador</th>
                      <th class="derecha" style="">Costo Unitario</th>
                      <th style="">Sub Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="(valor, i) in valores.filter(
                        (v) => v.eslocalflag == 1 && v.status == 1
                      )"
                      :key="i"
                    >
                      <td class="btnAccion">
                        <v-btn
                          icon
                          color="red"
                          x-small
                          @click="eliminarCostos({ costo: valor })"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </td>
                      <td class="colProveedorMultiplicador">
                        <v-autocomplete
                          dense
                          item-text="namelong"
                          item-value="id"
                          :items="$store.state.provedores"
                          v-model="valor.id_proveedor"
                          hide-details
                          append-icon="mdi-plus"
                          @click:append="abrirModalRegistroProveedor(valor)"
                        ></v-autocomplete>
                      </td>
                      <td class="colConcepto">
                        <v-text-field
                          dense
                          hide-details
                          v-model="valor.nameservice"
                        ></v-text-field>
                      </td>
                      <td class="colProveedorMultiplicador">
                        <v-select
                          class="widthTD"
                          :items="$store.state.pricing.listMultiplicador"
                          v-model="valor.id_multiplicador"
                          placeholder="Multiplicador"
                          hide-details
                          dense
                          @change="calcTotales"
                          :readonly="
                            isITBM(valor.code_cost) ||
                            isConfeccion(valor.code_cost) ||
                            isNotaCredito(valor.code_cost)
                          "
                        ></v-select>
                      </td>

                      <td class="colCostos">
                        <v-text-field
                          class="derecha tdMontos"
                          v-if="
                            isNotPorcentaje(valor, valor.id_multiplicador) &&
                            !isConfeccion(valor.code_cost) &&
                            !isITBM(valor.code_cost) &&
                            !isNotaCredito(valor.code_cost)
                          "
                          dense
                          max-width="50%"
                          v-model="valor.costounitario"
                          :error-messages="valor.error"
                          :rules="[
                            (v) => {
                              if (v > 0) {
                                valor.error = ''; // Borra el mensaje de error si el valor es válido
                                return true; // La regla se cumple
                              }
                              valor.error = 'El costo que tiene un valor 0.00.';
                              return false; // La regla no se cumple
                            },
                          ]"
                          prefix="$"
                          type="number"
                          step="0.01"
                          :min="valor.minimo"
                          v-on:blur="calcTotales"
                        ></v-text-field>
                        <v-text-field
                          class="derecha tdMontos"
                          v-if="
                            $store.state.pricing.listMultiplicador.some(
                              (v) =>
                                v.id == valor.id_multiplicador &&
                                (v.code == 13 || v.code == 14)
                            ) &&
                            !isITBM(valor.code_cost) &&
                            !isConfeccion(valor.code_cost) &&
                            !isNotaCredito(valor.code_cost)
                          "
                          hide-details
                          max-width="50%"
                          suffix="%"
                          dense
                          max="100"
                          v-model="valor.cif"
                          type="number"
                          :min="valor.minimo"
                          step="0.01"
                          v-on:blur="calcTotales"
                        ></v-text-field>
                        <v-text-field
                          max-width="50%"
                          suffix="%"
                          class="derecha tdMontos"
                          v-if="
                            $store.state.pricing.listMultiplicador.some(
                              (v) =>
                                v.id == valor.id_multiplicador && v.code == 5
                            ) &&
                            !isITBM(valor.code_cost) &&
                            !isConfeccion(valor.code_cost) &&
                            !isNotaCredito(valor.code_cost)
                          "
                          hide-details
                          dense
                          max="100"
                          v-model="valor.seguro"
                          type="number"
                          :min="valor.minimo"
                          step="0.01"
                          v-on:blur="calcTotales"
                        ></v-text-field>

                        <v-text-field
                          v-if="isITBM(valor.code_cost)"
                          readonly
                          dense
                          v-model="valor.costounitario"
                          :error-messages="valor.error"
                          prefix="$"
                        ></v-text-field>

                        <v-text-field
                          v-if="isConfeccion(valor.code_cost)"
                          readonly
                          dense
                          v-model="valor.costounitario"
                          :error-messages="valor.error"
                          prefix="$"
                        ></v-text-field>
                        <v-text-field
                          v-if="isNotaCredito(valor.code_cost)"
                          readonly
                          dense
                          v-model="valor.costounitario"
                          prefix="$"
                        ></v-text-field>
                      </td>

                      <td
                        class="colCostos"
                        v-if="
                          isNotPorcentaje(valor, valor.id_multiplicador) &&
                          !isConfeccion(valor.code_cost) &&
                          !isITBM(valor.code_cost) &&
                          !isNotaCredito(valor.code_cost)
                        "
                      >
                        {{
                          currencyFormat(
                            ($store.state.pricing.listMultiplicador.filter(
                              (v) => v.id == valor.id_multiplicador
                            ).length > 0
                              ? $store.state.pricing.listMultiplicador.filter(
                                  (v) => v.id == valor.id_multiplicador
                                )[0].valor
                              : 0) *
                              valor.costounitario *
                              calcularFac(
                                $store.state.pricing.listMultiplicador.filter(
                                  (v) => v.id == valor.id_multiplicador
                                ).length > 0
                                  ? $store.state.pricing.listMultiplicador.filter(
                                      (v) => v.id == valor.id_multiplicador
                                    )[0].code
                                  : "N",
                                $store.state.pricing.datosPrincipales.volumen,
                                $store.state.pricing.datosPrincipales.peso,
                                $store.state.pricing.datosPrincipales
                                  .containers,
                                $store.state.pricing.datosPrincipales.amount
                              )
                          )
                        }}
                      </td>

                      <td
                        class="colCostos"
                        v-if="
                          !isNotPorcentaje(valor, valor.id_multiplicador) &&
                          !isITBM(valor.code_cost) &&
                          !isConfeccion(valor.code_cost) &&
                          !isNotaCredito(valor.code_cost)
                        "
                      >
                        {{
                          currencyFormat(
                            calcularValor(
                              $store.state.pricing.datosPrincipales.amount,
                              $store.state.pricing.totalFlete,
                              $store.state.pricing.listMultiplicador.filter(
                                (v) => v.id == valor.id_multiplicador
                              ).length > 0
                                ? $store.state.pricing.listMultiplicador.filter(
                                    (v) => v.id == valor.id_multiplicador
                                  )[0].code
                                : "",
                              $store.state.pricing.listMultiplicador.some(
                                (v) =>
                                  v.id == valor.id_multiplicador &&
                                  (v.code == 14 || v.code == 13 || v.code == 5)
                              )
                                ? $store.state.pricing.listMultiplicador.some(
                                    (v) =>
                                      v.id == valor.id_multiplicador &&
                                      (v.code == 14 || v.code == 13)
                                  )
                                  ? valor.cif
                                  : valor.seguro
                                : 0
                            )
                          )
                        }}
                      </td>
                      <td
                        class="colCostos"
                        v-if="isConfeccion(valor.code_cost)"
                      >
                        {{ montoConfeccion(valor) }}
                      </td>
                      <td class="colCostos" v-if="isITBM(valor.code_cost)">
                        {{ montoITBM(valor) }}
                      </td>

                      <td
                        class="colCostos"
                        v-if="isNotaCredito(valor.code_cost)"
                      >
                        {{ montoNotaCredito(valor) }}
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col class="derecha" v-if="mostrarBtnLocalFlag">
          <v-btn color="success" @click="comprobarLocal()"
            >Ver siguientes costos</v-btn
          >
        </v-col>
      </v-row>
    </div>
    <div id="Aduana" v-if="mostrarAduana()">
      <v-row>
        <v-col cols="12">
          <v-expansion-panels class="condensed" v-model="valueAduana">
            <v-expansion-panel>
              <v-expansion-panel-header>
                {{
                  $store.state.pricing.listTipoCostos.length > 0
                    ? $store.state.pricing.listTipoCostos.filter(
                        (v) => v.codigo == "AD"
                      )[0].name
                    : ""
                }}:
                <span>{{ currencyFormat(resumenOpcion.aduana) }}</span>

                <v-icon
                  color="red"
                  v-if="
                    mostrarAdvertencia(
                      valores.filter((v) => v.esaduanaflag == 1)
                    )
                  "
                >
                  mdi-alert-circle
                </v-icon>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-simple-table dense>
                  <thead>
                    <tr>
                      <th></th>
                      <th style="">Proveedor</th>
                      <th style="">Conceptos</th>
                      <th style="">Multipicador</th>
                      <th class="derecha" style="">Costo Unitario</th>
                      <th style="">Sub Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="(valor, i) in valores.filter(
                        (v) => v.esaduanaflag == 1 && v.status == 1
                      )"
                      :key="i"
                    >
                      <td class="btnAccion">
                        <v-btn
                          icon
                          color="red"
                          x-small
                          @click="eliminarCostos({ costo: valor })"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </td>
                      <td class="colProveedorMultiplicador">
                        <v-autocomplete
                          dense
                          item-text="namelong"
                          item-value="id"
                          :items="$store.state.provedores"
                          v-model="valor.id_proveedor"
                          hide-details
                          append-icon="mdi-plus"
                          @click:append="abrirModalRegistroProveedor(valor)"
                        ></v-autocomplete>
                      </td>
                      <td class="colConcepto">
                        <v-text-field
                          dense
                          hide-details
                          v-model="valor.nameservice"
                        ></v-text-field>
                      </td>
                      <td class="colProveedorMultiplicador">
                        <v-select
                          class="widthTD"
                          :items="$store.state.pricing.listMultiplicador"
                          v-model="valor.id_multiplicador"
                          placeholder="Multiplicador"
                          hide-details
                          dense
                          @change="calcTotales"
                          :readonly="
                            isITBM(valor.code_cost) ||
                            isConfeccion(valor.code_cost) ||
                            isNotaCredito(valor.code_cost)
                          "
                        ></v-select>
                      </td>

                      <td class="colCostos">
                        <v-text-field
                          class="derecha tdMontos"
                          v-if="
                            isNotPorcentaje(valor, valor.id_multiplicador) &&
                            !isITBM(valor.code_cost) &&
                            !isConfeccion(valor.code_cost) &&
                            !isNotaCredito(valor.code_cost)
                          "
                          dense
                          max-width="50%"
                          v-model="valor.costounitario"
                          :error-messages="valor.error"
                          :rules="[
                            (v) => {
                              if (v > 0) {
                                valor.error = ''; // Borra el mensaje de error si el valor es válido
                                return true; // La regla se cumple
                              }
                              valor.error = 'El costo que tiene un valor 0.00.';
                              return false; // La regla no se cumple
                            },
                          ]"
                          prefix="$"
                          type="number"
                          step="0.01"
                          :min="valor.minimo"
                          v-on:blur="calcTotales"
                        ></v-text-field>
                        <v-text-field
                          class="derecha tdMontos"
                          v-if="
                            $store.state.pricing.listMultiplicador.some(
                              (v) =>
                                v.id == valor.id_multiplicador &&
                                (v.code == 13 || v.code == 14)
                            ) &&
                            !isITBM(valor.code_cost) &&
                            !isConfeccion(valor.code_cost) &&
                            !isNotaCredito(valor.code_cost)
                          "
                          hide-details
                          max-width="50%"
                          suffix="%"
                          dense
                          max="100"
                          v-model="valor.cif"
                          type="number"
                          :min="valor.minimo"
                          step="0.01"
                          v-on:blur="calcTotales"
                        ></v-text-field>
                        <v-text-field
                          max-width="50%"
                          suffix="%"
                          class="derecha tdMontos"
                          v-if="
                            $store.state.pricing.listMultiplicador.some(
                              (v) =>
                                v.id == valor.id_multiplicador && v.code == 5
                            ) &&
                            !isITBM(valor.code_cost) &&
                            !isConfeccion(valor.code_cost) &&
                            !isNotaCredito(valor.code_cost)
                          "
                          hide-details
                          dense
                          max="100"
                          v-model="valor.seguro"
                          type="number"
                          :min="valor.minimo"
                          step="0.01"
                          v-on:blur="calcTotales"
                        ></v-text-field>

                        <v-text-field
                          v-if="isITBM(valor.code_cost)"
                          readonly
                          dense
                          v-model="valor.costounitario"
                          :error-messages="valor.error"
                          prefix="$"
                        ></v-text-field>

                        <v-text-field
                          v-if="isConfeccion(valor.code_cost)"
                          readonly
                          dense
                          v-model="valor.costounitario"
                          :error-messages="valor.error"
                          prefix="$"
                        ></v-text-field>
                        <v-text-field
                          v-if="isNotaCredito(valor.code_cost)"
                          readonly
                          dense
                          v-model="valor.costounitario"
                          prefix="$"
                        ></v-text-field>
                      </td>

                      <td
                        class="colCostos"
                        v-if="
                          isNotPorcentaje(valor, valor.id_multiplicador) &&
                          !isITBM(valor.code_cost) &&
                          !isConfeccion(valor.code_cost) &&
                          !isNotaCredito(valor.code_cost)
                        "
                      >
                        {{
                          currencyFormat(
                            ($store.state.pricing.listMultiplicador.filter(
                              (v) => v.id == valor.id_multiplicador
                            ).length > 0
                              ? $store.state.pricing.listMultiplicador.filter(
                                  (v) => v.id == valor.id_multiplicador
                                )[0].valor
                              : 0) *
                              valor.costounitario *
                              calcularFac(
                                $store.state.pricing.listMultiplicador.filter(
                                  (v) => v.id == valor.id_multiplicador
                                ).length > 0
                                  ? $store.state.pricing.listMultiplicador.filter(
                                      (v) => v.id == valor.id_multiplicador
                                    )[0].code
                                  : "N",
                                $store.state.pricing.datosPrincipales.volumen,
                                $store.state.pricing.datosPrincipales.peso,
                                $store.state.pricing.datosPrincipales
                                  .containers,
                                $store.state.pricing.datosPrincipales.amount
                              )
                          )
                        }}
                      </td>

                      <td
                        class="colCostos"
                        v-if="
                          !isNotPorcentaje(valor, valor.id_multiplicador) &&
                          !isITBM(valor.code_cost) &&
                          !isConfeccion(valor.code_cost) &&
                          !isNotaCredito(valor.code_cost)
                        "
                      >
                        {{
                          currencyFormat(
                            calcularValor(
                              $store.state.pricing.datosPrincipales.amount,
                              $store.state.pricing.totalFlete,
                              $store.state.pricing.listMultiplicador.filter(
                                (v) => v.id == valor.id_multiplicador
                              ).length > 0
                                ? $store.state.pricing.listMultiplicador.filter(
                                    (v) => v.id == valor.id_multiplicador
                                  )[0].code
                                : "",
                              $store.state.pricing.listMultiplicador.some(
                                (v) =>
                                  v.id == valor.id_multiplicador &&
                                  (v.code == 14 || v.code == 13 || v.code == 5)
                              )
                                ? $store.state.pricing.listMultiplicador.some(
                                    (v) =>
                                      v.id == valor.id_multiplicador &&
                                      (v.code == 14 || v.code == 13)
                                  )
                                  ? valor.cif
                                  : valor.seguro
                                : 0
                            )
                          )
                        }}
                      </td>
                      <td
                        class="colCostos"
                        v-if="isConfeccion(valor.code_cost)"
                      >
                        {{ montoConfeccion(valor) }}
                      </td>
                      <td class="colCostos" v-if="isITBM(valor.code_cost)">
                        {{ montoITBM(valor) }}
                      </td>

                      <td
                        class="colCostos"
                        v-if="isNotaCredito(valor.code_cost)"
                      >
                        {{ montoNotaCredito(valor) }}
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col class="derecha" v-if="mostrarBtnAduanaFlag">
          <v-btn color="success" @click="comprobarAduana()"
            >Ver siguientes costos</v-btn
          >
        </v-col>
      </v-row>
    </div>
    <div id="FleteExport" v-if="mostrarFleteExport()">
      <v-row>
        <v-col cols="12">
          <v-expansion-panels class="condensed" v-model="valueFleteExport">
            <v-expansion-panel>
              <v-expansion-panel-header>
                {{
                  $store.state.pricing.listTipoCostos.length > 0
                    ? $store.state.pricing.listTipoCostos.filter(
                        (v) => v.codigo == "FL"
                      )[0].name
                    : ""
                }}:

                <span>{{ currencyFormat(resumenOpcion.flete) }} </span>

                <v-icon
                  color="red"
                  v-if="
                    mostrarAdvertencia(
                      valores.filter((v) => v.esfleteflag == 1)
                    )
                  "
                >
                  mdi-alert-circle
                </v-icon>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-simple-table dense>
                  <thead>
                    <tr>
                      <th></th>
                      <th style="">Proveedor</th>
                      <th style="">Conceptos</th>
                      <th style="">Multipicador</th>
                      <th class="derecha" style="">Costo Unitario</th>
                      <th style="">Sub Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="(valor, i) in valores.filter(
                        (v) => v.esfleteflag == 1 && v.status == 1
                      )"
                      :key="i"
                    >
                      <td class="btnAccion">
                        <v-btn
                          icon
                          color="red"
                          x-small
                          @click="eliminarCostos({ costo: valor })"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </td>
                      <td class="colProveedorMultiplicador">
                        <v-autocomplete
                          dense
                          item-text="namelong"
                          item-value="id"
                          :items="$store.state.provedores"
                          v-model="valor.id_proveedor"
                          hide-details
                          append-icon="mdi-plus"
                          @click:append="abrirModalRegistroProveedor(valor)"
                        ></v-autocomplete>
                      </td>
                      <td class="colConcepto">
                        <v-text-field
                          dense
                          hide-details
                          v-model="valor.nameservice"
                        ></v-text-field>
                      </td>
                      <td class="colProveedorMultiplicador">
                        <v-select
                          class="widthTD"
                          :items="$store.state.pricing.listMultiplicador"
                          v-model="valor.id_multiplicador"
                          placeholder="Multiplicador"
                          hide-details
                          dense
                          @change="calcTotales"
                          :readonly="
                            isITBM(valor.code_cost) ||
                            isConfeccion(valor.code_cost) ||
                            isNotaCredito(valor.code_cost)
                          "
                        ></v-select>
                      </td>

                      <td class="colCostos">
                        <v-text-field
                          class="derecha tdMontos"
                          v-if="
                            isNotPorcentaje(valor, valor.id_multiplicador) &&
                            !isConfeccion(valor.code_cost) &&
                            !isITBM(valor.code_cost) &&
                            !isNotaCredito(valor.code_cost)
                          "
                          dense
                          max-width="50%"
                          v-model="valor.costounitario"
                          :error-messages="valor.error"
                          :rules="[
                            (v) => {
                              if (v > 0) {
                                valor.error = ''; // Borra el mensaje de error si el valor es válido
                                return true; // La regla se cumple
                              }
                              valor.error = 'El costo que tiene un valor 0.00.';
                              return false; // La regla no se cumple
                            },
                          ]"
                          prefix="$"
                          type="number"
                          step="0.01"
                          :min="valor.minimo"
                          v-on:blur="calcTotales"
                        ></v-text-field>
                        <v-text-field
                          class="derecha tdMontos"
                          v-if="
                            $store.state.pricing.listMultiplicador.some(
                              (v) =>
                                v.id == valor.id_multiplicador &&
                                (v.code == 13 || v.code == 14)
                            ) &&
                            !isITBM(valor.code_cost) &&
                            !isConfeccion(valor.code_cost) &&
                            !isNotaCredito(valor.code_cost)
                          "
                          hide-details
                          max-width="50%"
                          suffix="%"
                          dense
                          max="100"
                          v-model="valor.cif"
                          type="number"
                          :min="valor.minimo"
                          step="0.01"
                          v-on:blur="calcTotales"
                        ></v-text-field>
                        <v-text-field
                          max-width="50%"
                          suffix="%"
                          class="derecha tdMontos"
                          v-if="
                            $store.state.pricing.listMultiplicador.some(
                              (v) =>
                                v.id == valor.id_multiplicador && v.code == 5
                            ) &&
                            !isITBM(valor.code_cost) &&
                            !isConfeccion(valor.code_cost) &&
                            !isNotaCredito(valor.code_cost)
                          "
                          hide-details
                          dense
                          max="100"
                          v-model="valor.seguro"
                          type="number"
                          :min="valor.minimo"
                          step="0.01"
                          v-on:blur="calcTotales"
                        ></v-text-field>

                        <v-text-field
                          v-if="isITBM(valor.code_cost)"
                          readonly
                          dense
                          v-model="valor.costounitario"
                          :error-messages="valor.error"
                          prefix="$"
                        ></v-text-field>

                        <v-text-field
                          v-if="isConfeccion(valor.code_cost)"
                          readonly
                          dense
                          v-model="valor.costounitario"
                          :error-messages="valor.error"
                          prefix="$"
                        ></v-text-field>
                        <v-text-field
                          v-if="isNotaCredito(valor.code_cost)"
                          readonly
                          dense
                          v-model="valor.costounitario"
                          prefix="$"
                        ></v-text-field>
                      </td>

                      <td
                        class="colCostos"
                        v-if="
                          isNotPorcentaje(valor, valor.id_multiplicador) &&
                          !isConfeccion(valor.code_cost) &&
                          !isITBM(valor.code_cost) &&
                          !isNotaCredito(valor.code_cost)
                        "
                      >
                        {{
                          currencyFormat(
                            ($store.state.pricing.listMultiplicador.filter(
                              (v) => v.id == valor.id_multiplicador
                            ).length > 0
                              ? $store.state.pricing.listMultiplicador.filter(
                                  (v) => v.id == valor.id_multiplicador
                                )[0].valor
                              : 0) *
                              valor.costounitario *
                              calcularFac(
                                $store.state.pricing.listMultiplicador.filter(
                                  (v) => v.id == valor.id_multiplicador
                                ).length > 0
                                  ? $store.state.pricing.listMultiplicador.filter(
                                      (v) => v.id == valor.id_multiplicador
                                    )[0].code
                                  : "N",
                                $store.state.pricing.datosPrincipales.volumen,
                                $store.state.pricing.datosPrincipales.peso,
                                $store.state.pricing.datosPrincipales
                                  .containers,
                                $store.state.pricing.datosPrincipales.amount
                              )
                          )
                        }}
                      </td>

                      <td
                        class="colCostos"
                        v-if="
                          !isNotPorcentaje(valor, valor.id_multiplicador) &&
                          !isITBM(valor.code_cost) &&
                          !isConfeccion(valor.code_cost) &&
                          !isNotaCredito(valor.code_cost)
                        "
                      >
                        {{
                          currencyFormat(
                            calcularValor(
                              $store.state.pricing.datosPrincipales.amount,
                              $store.state.pricing.totalFlete,
                              $store.state.pricing.listMultiplicador.filter(
                                (v) => v.id == valor.id_multiplicador
                              ).length > 0
                                ? $store.state.pricing.listMultiplicador.filter(
                                    (v) => v.id == valor.id_multiplicador
                                  )[0].code
                                : "",
                              $store.state.pricing.listMultiplicador.some(
                                (v) =>
                                  v.id == valor.id_multiplicador &&
                                  (v.code == 14 || v.code == 13 || v.code == 5)
                              )
                                ? $store.state.pricing.listMultiplicador.some(
                                    (v) =>
                                      v.id == valor.id_multiplicador &&
                                      (v.code == 14 || v.code == 13)
                                  )
                                  ? valor.cif
                                  : valor.seguro
                                : 0
                            )
                          )
                        }}
                      </td>
                      <td
                        class="colCostos"
                        v-if="isConfeccion(valor.code_cost)"
                      >
                        {{ montoConfeccion(valor) }}
                      </td>
                      <td class="colCostos" v-if="isITBM(valor.code_cost)">
                        {{ montoITBM(valor) }}
                      </td>

                      <td
                        class="colCostos"
                        v-if="isNotaCredito(valor.code_cost)"
                      >
                        {{ montoNotaCredito(valor) }}
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col class="derecha" v-if="mostrarBtnFleteExportFlag">
          <v-btn color="success" @click="comprobarFleteExport()"
            >Ver siguientes costos</v-btn
          >
        </v-col>
      </v-row>
    </div>
    <div id="Almacen" v-if="mostrarAlmacen()">
      <v-row>
        <v-col cols="12">
          <v-expansion-panels class="condensed" v-model="valueAlmacen">
            <v-expansion-panel>
              <v-expansion-panel-header>
                {{
                  $store.state.pricing.listTipoCostos.length > 0
                    ? $store.state.pricing.listTipoCostos.filter(
                        (v) => v.codigo == "AL"
                      )[0].name
                    : ""
                }}:
                <span>{{ currencyFormat(resumenOpcion.almacen) }}</span>
                <v-icon
                  color="red"
                  v-if="
                    mostrarAdvertencia(
                      valores.filter((v) => v.esalmacenflag == 1)
                    )
                  "
                >
                  mdi-alert-circle
                </v-icon>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-simple-table dense>
                  <thead>
                    <tr>
                      <th style=""></th>
                      <th style="">Proveedor</th>
                      <th style="">Conceptos</th>
                      <th style="">Multipicador</th>
                      <th class="derecha" style="">Costo Unitario</th>
                      <th style="">Sub Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="(valor, i) in valores.filter(
                        (v) => v.esalmacenflag == 1 && v.status == 1
                      )"
                      :key="i"
                    >
                      <td class="btnAccion">
                        <v-btn
                          icon
                          color="red"
                          x-small
                          @click="eliminarCostos({ costo: valor })"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </td>
                      <td class="colProveedorMultiplicador">
                        <v-autocomplete
                          dense
                          item-text="namelong"
                          item-value="id"
                          :items="$store.state.provedores"
                          v-model="valor.id_proveedor"
                          hide-details
                          append-icon="mdi-plus"
                          @click:append="abrirModalRegistroProveedor(valor)"
                        ></v-autocomplete>
                      </td>
                      <td class="colConcepto">
                        <v-text-field
                          dense
                          hide-details
                          v-model="valor.nameservice"
                        ></v-text-field>
                      </td>
                      <td class="colProveedorMultiplicador">
                        <v-select
                          class="widthTD"
                          :items="$store.state.pricing.listMultiplicador"
                          v-model="valor.id_multiplicador"
                          placeholder="Multiplicador"
                          hide-details
                          dense
                          @change="calcTotales"
                          :readonly="
                            isITBM(valor.code_cost) ||
                            isConfeccion(valor.code_cost) ||
                            isNotaCredito(valor.code_cost)
                          "
                        ></v-select>
                      </td>

                      <td class="colCostos">
                        <v-text-field
                          class="derecha tdMontos"
                          v-if="
                            isNotPorcentaje(valor, valor.id_multiplicador) &&
                            !isITBM(valor.code_cost) &&
                            !isConfeccion(valor.code_cost) &&
                            !isNotaCredito(valor.code_cost)
                          "
                          dense
                          max-width="50%"
                          v-model="valor.costounitario"
                          :error-messages="valor.error"
                          :rules="[
                            (v) => {
                              if (v > 0) {
                                valor.error = ''; // Borra el mensaje de error si el valor es válido
                                return true; // La regla se cumple
                              }
                              valor.error = 'El costo que tiene un valor 0.00.';
                              return false; // La regla no se cumple
                            },
                          ]"
                          prefix="$"
                          type="number"
                          step="0.01"
                          :min="valor.minimo"
                          v-on:blur="calcTotales"
                        ></v-text-field>
                        <v-text-field
                          class="derecha tdMontos"
                          v-if="
                            $store.state.pricing.listMultiplicador.some(
                              (v) =>
                                v.id == valor.id_multiplicador &&
                                (v.code == 13 || v.code == 14)
                            ) &&
                            !isITBM(valor.code_cost) &&
                            !isConfeccion(valor.code_cost) &&
                            !isNotaCredito(valor.code_cost)
                          "
                          hide-details
                          max-width="50%"
                          suffix="%"
                          dense
                          max="100"
                          v-model="valor.cif"
                          type="number"
                          :min="valor.minimo"
                          step="0.01"
                          v-on:blur="calcTotales"
                        ></v-text-field>
                        <v-text-field
                          max-width="50%"
                          suffix="%"
                          class="derecha tdMontos"
                          v-if="
                            ($store.state.pricing.listMultiplicador.filter(
                              (v) => v.id == valor.id_multiplicador
                            )[0].code == 14 ||
                              $store.state.pricing.listMultiplicador.filter(
                                (v) => v.id == valor.id_multiplicador
                              )[0].code == 5) &&
                            !isITBM(valor.code_cost) &&
                            !isConfeccion(valor.code_cost) &&
                            !isNotaCredito(valor.code_cost)
                          "
                          hide-details
                          dense
                          max="100"
                          v-model="valor.seguro"
                          type="number"
                          :min="valor.minimo"
                          step="0.01"
                          v-on:blur="calcTotales"
                        ></v-text-field>

                        <v-text-field
                          v-if="isITBM(valor.code_cost)"
                          readonly
                          dense
                          v-model="valor.costounitario"
                          :error-messages="valor.error"
                          prefix="$"
                        ></v-text-field>

                        <v-text-field
                          v-if="isConfeccion(valor.code_cost)"
                          readonly
                          dense
                          v-model="valor.costounitario"
                          :error-messages="valor.error"
                          prefix="$"
                        ></v-text-field>
                        <v-text-field
                          v-if="isNotaCredito(valor.code_cost)"
                          readonly
                          dense
                          v-model="valor.costounitario"
                          prefix="$"
                        ></v-text-field>
                      </td>

                      <td
                        class="colCostos"
                        v-if="
                          isNotPorcentaje(valor, valor.id_multiplicador) &&
                          !isITBM(valor.code_cost) &&
                          !isConfeccion(valor.code_cost) &&
                          !isNotaCredito(valor.code_cost)
                        "
                      >
                        {{
                          currencyFormat(
                            ($store.state.pricing.listMultiplicador.filter(
                              (v) => v.id == valor.id_multiplicador
                            ).length > 0
                              ? $store.state.pricing.listMultiplicador.filter(
                                  (v) => v.id == valor.id_multiplicador
                                )[0].valor
                              : 0) *
                              valor.costounitario *
                              calcularFac(
                                $store.state.pricing.listMultiplicador.filter(
                                  (v) => v.id == valor.id_multiplicador
                                ).length > 0
                                  ? $store.state.pricing.listMultiplicador.filter(
                                      (v) => v.id == valor.id_multiplicador
                                    )[0].code
                                  : "N",
                                $store.state.pricing.datosPrincipales.volumen,
                                $store.state.pricing.datosPrincipales.peso,
                                $store.state.pricing.datosPrincipales
                                  .containers,
                                $store.state.pricing.datosPrincipales.amount
                              )
                          )
                        }}
                      </td>

                      <td
                        class="colCostos"
                        v-if="
                          !isNotPorcentaje(valor, valor.id_multiplicador) &&
                          !isITBM(valor.code_cost) &&
                          !isConfeccion(valor.code_cost) &&
                          !isNotaCredito(valor.code_cost)
                        "
                      >
                        {{
                          currencyFormat(
                            calcularValor(
                              $store.state.pricing.datosPrincipales.amount,
                              $store.state.pricing.totalFlete,
                              $store.state.pricing.listMultiplicador.filter(
                                (v) => v.id == valor.id_multiplicador
                              ).length > 0
                                ? $store.state.pricing.listMultiplicador.filter(
                                    (v) => v.id == valor.id_multiplicador
                                  )[0].code
                                : "",
                              $store.state.pricing.listMultiplicador.some(
                                (v) =>
                                  v.id == valor.id_multiplicador &&
                                  (v.code == 14 || v.code == 13 || v.code == 5)
                              )
                                ? $store.state.pricing.listMultiplicador.some(
                                    (v) =>
                                      v.id == valor.id_multiplicador &&
                                      (v.code == 14 || v.code == 13)
                                  )
                                  ? valor.cif
                                  : valor.seguro
                                : 0
                            )
                          )
                        }}
                      </td>
                      <td
                        class="colCostos"
                        v-if="isConfeccion(valor.code_cost)"
                      >
                        {{ montoConfeccion(valor) }}
                      </td>
                      <td class="colCostos" v-if="isITBM(valor.code_cost)">
                        {{ montoITBM(valor) }}
                      </td>

                      <td
                        class="colCostos"
                        v-if="isNotaCredito(valor.code_cost)"
                      >
                        {{ montoNotaCredito(valor) }}
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col class="derecha" v-if="mostrarBtnAlmacenFlag">
          <v-btn color="success" @click="comprobarAlmacen()"
            >Ver siguientes costos</v-btn
          >
        </v-col>
      </v-row>
    </div>
    <div id="gastosTerceros" v-if="mostrarGastosTerceros()">
      <v-row>
        <v-col cols="12">
          <v-expansion-panels class="condensed" v-model="valueGastosTerceros">
            <v-expansion-panel>
              <v-expansion-panel-header>
                {{
                  $store.state.pricing.listTipoCostos.length > 0
                    ? $store.state.pricing.listTipoCostos.filter(
                        (v) => v.codigo == "GT"
                      )[0].name
                    : ""
                }}:
                <span>{{ currencyFormat(resumenOpcion.gastostercero) }}</span>
                <v-icon
                  color="red"
                  v-if="
                    mostrarAdvertencia(
                      valores.filter((v) => v.esgastostercerosflag == 1)
                    )
                  "
                >
                  mdi-alert-circle
                </v-icon>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-simple-table dense>
                  <thead>
                    <tr>
                      <th style=""></th>
                      <th style="">Proveedor</th>
                      <th style="">Conceptos</th>
                      <th style="">Multipicador</th>
                      <th class="derecha" style="">Costo Unitario</th>
                      <th style="">Sub Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="(valor, i) in valores.filter(
                        (v) => v.esgastostercerosflag == 1 && v.status == 1
                      )"
                      :key="i"
                    >
                      <td class="btnAccion">
                        <v-btn
                          icon
                          color="red"
                          x-small
                          @click="eliminarCostos({ costo: valor })"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </td>
                      <td class="colProveedorMultiplicador">
                        <v-autocomplete
                          dense
                          item-text="namelong"
                          item-value="id"
                          :items="$store.state.provedores"
                          v-model="valor.id_proveedor"
                          hide-details
                          append-icon="mdi-plus"
                          @click:append="abrirModalRegistroProveedor(valor)"
                        ></v-autocomplete>
                      </td>
                      <td class="colConcepto">
                        <v-text-field
                          dense
                          hide-details
                          v-model="valor.nameservice"
                        ></v-text-field>
                      </td>
                      <td class="colProveedorMultiplicador">
                        <v-select
                          class="widthTD"
                          :items="$store.state.pricing.listMultiplicador"
                          v-model="valor.id_multiplicador"
                          placeholder="Multiplicador"
                          hide-details
                          dense
                          @change="calcTotales"
                          :readonly="
                            isITBM(valor.code_cost) ||
                            isConfeccion(valor.code_cost) ||
                            isNotaCredito(valor.code_cost)
                          "
                        ></v-select>
                      </td>

                      <td class="colCostos">
                        <v-text-field
                          class="derecha tdMontos"
                          v-if="
                            isNotPorcentaje(valor, valor.id_multiplicador) &&
                            !isITBM(valor.code_cost) &&
                            !isConfeccion(valor.code_cost) &&
                            !isNotaCredito(valor.code_cost)
                          "
                          dense
                          max-width="50%"
                          v-model="valor.costounitario"
                          :error-messages="valor.error"
                          :rules="[
                            (v) => {
                              if (v > 0) {
                                valor.error = ''; // Borra el mensaje de error si el valor es válido
                                return true; // La regla se cumple
                              }
                              valor.error = 'El costo que tiene un valor 0.00.';
                              return false; // La regla no se cumple
                            },
                          ]"
                          prefix="$"
                          type="number"
                          step="0.01"
                          :min="valor.minimo"
                          v-on:blur="calcTotales"
                        ></v-text-field>
                        <v-text-field
                          class="derecha tdMontos"
                          v-if="
                            $store.state.pricing.listMultiplicador.some(
                              (v) =>
                                v.id == valor.id_multiplicador &&
                                (v.code == 13 || v.code == 14)
                            ) &&
                            !isITBM(valor.code_cost) &&
                            !isConfeccion(valor.code_cost) &&
                            !isNotaCredito(valor.code_cost)
                          "
                          hide-details
                          max-width="50%"
                          suffix="%"
                          dense
                          max="100"
                          v-model="valor.cif"
                          type="number"
                          :min="valor.minimo"
                          step="0.01"
                          v-on:blur="calcTotales"
                        ></v-text-field>
                        <v-text-field
                          max-width="50%"
                          suffix="%"
                          class="derecha tdMontos"
                          v-if="
                            ($store.state.pricing.listMultiplicador.filter(
                              (v) => v.id == valor.id_multiplicador
                            )[0].code == 14 ||
                              $store.state.pricing.listMultiplicador.filter(
                                (v) => v.id == valor.id_multiplicador
                              )[0].code == 5) &&
                            !isITBM(valor.code_cost) &&
                            !isConfeccion(valor.code_cost) &&
                            !isNotaCredito(valor.code_cost)
                          "
                          hide-details
                          dense
                          max="100"
                          v-model="valor.seguro"
                          type="number"
                          :min="valor.minimo"
                          step="0.01"
                          v-on:blur="calcTotales"
                        ></v-text-field>

                        <v-text-field
                          v-if="isITBM(valor.code_cost)"
                          readonly
                          dense
                          v-model="valor.costounitario"
                          :error-messages="valor.error"
                          prefix="$"
                        ></v-text-field>

                        <v-text-field
                          v-if="isConfeccion(valor.code_cost)"
                          readonly
                          dense
                          v-model="valor.costounitario"
                          :error-messages="valor.error"
                          prefix="$"
                        ></v-text-field>
                        <v-text-field
                          v-if="isNotaCredito(valor.code_cost)"
                          readonly
                          dense
                          v-model="valor.costounitario"
                          prefix="$"
                        ></v-text-field>
                      </td>

                      <td
                        class="colCostos"
                        v-if="
                          isNotPorcentaje(valor, valor.id_multiplicador) &&
                          !isITBM(valor.code_cost) &&
                          !isConfeccion(valor.code_cost) &&
                          !isNotaCredito(valor.code_cost)
                        "
                      >
                        {{
                          currencyFormat(
                            ($store.state.pricing.listMultiplicador.filter(
                              (v) => v.id == valor.id_multiplicador
                            ).length > 0
                              ? $store.state.pricing.listMultiplicador.filter(
                                  (v) => v.id == valor.id_multiplicador
                                )[0].valor
                              : 0) *
                              valor.costounitario *
                              calcularFac(
                                $store.state.pricing.listMultiplicador.filter(
                                  (v) => v.id == valor.id_multiplicador
                                ).length > 0
                                  ? $store.state.pricing.listMultiplicador.filter(
                                      (v) => v.id == valor.id_multiplicador
                                    )[0].code
                                  : "N",
                                $store.state.pricing.datosPrincipales.volumen,
                                $store.state.pricing.datosPrincipales.peso,
                                $store.state.pricing.datosPrincipales
                                  .containers,
                                $store.state.pricing.datosPrincipales.amount
                              )
                          )
                        }}
                      </td>

                      <td
                        class="colCostos"
                        v-if="
                          !isNotPorcentaje(valor, valor.id_multiplicador) &&
                          !isITBM(valor.code_cost) &&
                          !isConfeccion(valor.code_cost) &&
                          !isNotaCredito(valor.code_cost)
                        "
                      >
                        {{
                          currencyFormat(
                            calcularValor(
                              $store.state.pricing.datosPrincipales.amount,
                              $store.state.pricing.totalFlete,
                              $store.state.pricing.listMultiplicador.filter(
                                (v) => v.id == valor.id_multiplicador
                              ).length > 0
                                ? $store.state.pricing.listMultiplicador.filter(
                                    (v) => v.id == valor.id_multiplicador
                                  )[0].code
                                : "",
                              $store.state.pricing.listMultiplicador.some(
                                (v) =>
                                  v.id == valor.id_multiplicador &&
                                  (v.code == 14 || v.code == 13 || v.code == 5)
                              )
                                ? $store.state.pricing.listMultiplicador.some(
                                    (v) =>
                                      v.id == valor.id_multiplicador &&
                                      (v.code == 14 || v.code == 13)
                                  )
                                  ? valor.cif
                                  : valor.seguro
                                : 0
                            )
                          )
                        }}
                      </td>
                      <td
                        class="colCostos"
                        v-if="isConfeccion(valor.code_cost)"
                      >
                        {{ montoConfeccion(valor) }}
                      </td>
                      <td class="colCostos" v-if="isITBM(valor.code_cost)">
                        {{ montoITBM(valor) }}
                      </td>

                      <td
                        class="colCostos"
                        v-if="isNotaCredito(valor.code_cost)"
                      >
                        {{ montoNotaCredito(valor) }}
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col class="derecha" v-if="mostrarBtnGastosTercerosFlag">
          <v-btn color="success" @click="comprobarGastosTerceros()"
            >Ver siguientes costos</v-btn
          >
        </v-col>
      </v-row>
    </div>
    <div class="derecha mt-5">
      <v-btn
        color="#004D40"
        dark
        @click="abrirModal"
        v-if="$store.state.pricing.mostrarGuardarCostos"
      >
        Agregar Costos Adicionales
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import NuevoProveedorComponentVue from "../../../folderEntities/Proveedor/NuevoProveedorComponent.vue";
import mixins from "../../../mixins/funciones.js";
export default {
  mixins: [mixins],
  props: ["valores", "actualizarCostosFlag", "amount", "index"],
  components: { NuevoProveedorComponentVue },
  data() {
    return {
      costo: {},
      dialogNuevoProveedor: false,
      totalOption: 0,
      valueFleteImport: 0,
      valueOrigen: 0,
      valueLocal: 0,
      valueAduana: 0,
      valueFleteExport: 0,
      valueAlmacen: 0,
      valueGastosTerceros: 0,
      resumenOpcion: {
        flete: 0,
        origen: 0,
        gasto: 0,
        aduana: 0,
        almacen: 0,
        gastostercero: 0,
      },
      dialog: false,
      // -----------------------------
      mostrarBtnFleteImportFlag: true,
      mostrarBtnOrigenFlag: true,
      mostrarBtnLocalFlag: true,
      mostrarBtnAduanaFlag: true,
      mostrarBtnFleteExportFlag: true,
      mostrarBtnAlmacenFlag: true,
      mostrarBtnGastosTercerosFlag: true,
      // -----------------------------

      // -----------------------------
      mostrarFleteImportFlag: false,
      mostrarOrigenFlag: false,
      mostrarLocalFlag: false,
      mostrarAduanaFlag: false,
      mostrarFleteExportFlag: false,
      mostrarAlmacenFlag: false,
      mostrarGastosTercerosFlag: false,
      // -----------------------------
      fromDataService: {
        ventaFlag: 0,
        esopcionflag: 1,
        id_begend: 0,
        costounitario: "",
        esorigenflag: 0,
        eslocalflag: 0,
        esaduanaflag: 0,
        esalmacenflag: 0,
        esgastostercerosflag: 0,
        seguro: 0,
        cif: 0,
        esventaflag: 0,
        status: 1,
        id_groupservices: 0,
        id_multiplicador: 0,
        id_proveedor: 0,
      },
    };
  },
  async mounted() {
    this.calcTotales();
    this.$store.state.pricing.mostrarGuardarCostos = false;
    await this.habilidarPrimeraAccion();
    if (!!this.index) {
      this.habilidarCuandoYaHayOpciones();
    }
  },
  methods: {
    ...mapActions(["guardarProveedor", "cargarProveedores"]),
    async nuevoProveedor() {
      let res = await this.guardarProveedor();
      if (!!res.estadoflag) {
        await this.cargarProveedores();
        this.costo.id_proveedor = res.data[0].id_entitie;
        this.dialogNuevoProveedor = false;
      }
    },
    guardarProveedorE(val) {
      this.costo.id_proveedor = val;
      this.dialogNuevoProveedor = false;
    },
    abrirModalRegistroProveedor(item) {
      this.costo = item;
      this.dialogNuevoProveedor = true;
    },
    mostrarBtnRegistroProveedor() {
      if (!this.$store.state.entities.proveedor.nombrecompleto) {
        return false;
      }
      if (!this.$store.state.entities.proveedor.id_tipoproveedor) {
        return false;
      }
      if (!this.$store.state.entities.proveedor.id_tipotransaccion) {
        return false;
      }
      if (!this.$store.state.entities.proveedor.id_pais) {
        return false;
      }
      return true;
    },
    habilidarCuandoYaHayOpciones() {
      if (this.isFlete() && this.isImport()) {
        this.mostrarFleteImportFlag = true;
      }
      if (this.isOrigen()) {
        this.mostrarOrigenFlag = true;
      }
      if (this.isLocal()) {
        this.mostrarLocalFlag = true;
      }

      if (this.isAduana()) {
        this.mostrarAduanaFlag = true;
      }
      if (this.isFlete() && !this.isImport()) {
        this.mostrarFleteExportFlag = true;
      }
      if (this.isAlmacen()) {
        this.mostrarAlmacenFlag = true;
      }
      if (this.isGastosTercero()) {
        this.mostrarGastosTercerosFlag = true;
      }
      this.mostrarBtnFleteImportFlag = false;
      this.mostrarBtnOrigenFlag = false;
      this.mostrarBtnLocalFlag = false;
      this.mostrarBtnAduanaFlag = false;
      this.mostrarBtnFleteExportFlag = false;
      this.mostrarBtnAlmacenFlag = false;
      this.mostrarBtnGastosTercerosFlag = false;
      this.valueFleteImport = 1;
      this.valueOrigen = 1;
      this.valueLocal = 1;
      this.valueAduana = 1;
      this.valueFleteExport = 1;
      this.valueAlmacen = 1;
      this.valueGastosTerceros = 1;
    },
    async habilidarPrimeraAccion() {
      if (this.isFlete() && this.isImport()) {
        this.mostrarFleteImportFlag = true;
        return true;
      }
      if (this.isOrigen()) {
        this.mostrarOrigenFlag = true;
        return true;
      }
      if (this.isLocal()) {
        this.mostrarLocalFlag = true;
        return true;
      }

      if (this.isAduana()) {
        this.mostrarAduanaFlag = true;
        return true;
      }
      if (this.isFlete() && !this.isImport()) {
        this.mostrarFleteExportFlag = true;
        return true;
      }
      if (this.isAlmacen()) {
        this.mostrarAlmacenFlag = true;
        return true;
      }
      if (this.isGastosTercero()) {
        this.mostrarGastosTercerosFlag = true;
        return true;
      }
    },
    async comprobarFleteImport() {
      this.valores
        .filter((v) => v.esfleteflag == 1 && v.status == true)
        .forEach((element) => {
          let res = this.validateCost({ costo: element });

          if (!!res) {
            element.error = "El costo que tiene un valor 0.00.";
          } else {
            element.error = "";
          }
        });
      let val = !this.valores.some(
        (v) => v.esfleteflag == 1 && v.status == true && v.error != ""
      );

      if (val) {
        await this.mostrarSiguienteFleteImport();
        this.valueFleteImport = 1;
        this.mostrarBtnFleteImportFlag = false;
      }
    },
    mostrarSiguienteFleteImport() {
      if (this.isOrigen()) {
        console.log("isOrigen");
        this.mostrarOrigenFlag = true;
        return true;
      }
      if (this.isLocal()) {
        console.log("isLocal");
        this.mostrarLocalFlag = true;
        return true;
      }
      if (this.isAduana()) {
        console.log("isAduana");
        this.mostrarAduanaFlag = true;
        return true;
      }
      if (this.isFlete() && !this.isImport()) {
        console.log("isFlete");
        this.mostrarFleteExportFlag = true;
        return true;
      }

      if (this.isAlmacen()) {
        console.log("isAlmacen");
        this.mostrarAlmacenFlag = true;
        return true;
      }
      if (this.isGastosTercero()) {
        console.log("isGastosTercero");
        this.mostrarGastosTercerosFlag = true;
        return true;
      }
      this.$store.state.pricing.mostrarGuardarCostos = true;
    },
    async comprobarOrigen() {
      this.valores
        .filter((v) => v.esorigenflag == 1 && v.status == true)
        .forEach((element) => {
          let res = this.validateCost({ costo: element });

          if (!!res) {
            element.error = "El costo que tiene un valor 0.00.";
          } else {
            element.error = "";
          }
        });
      let val = !this.valores.some(
        (v) => v.esorigenflag == 1 && v.status == true && v.error != ""
      );

      if (val) {
        await this.mostrarSiguienteOrigen();
        this.valueOrigen = 1;
        this.mostrarBtnOrigenFlag = false;
        if (
          !this.mostrarSiguienteOrigen() &&
          !this.mostrarSiguienteLocal() &&
          !this.mostrarSiguienteFleteExport() &&
          !this.mostrarSiguienteAduana()
        ) {
          this.$store.state.pricing.mostrarGuardarCostos = true;
        }
      }
    },
    mostrarSiguienteOrigen() {
      if (this.isLocal()) {
        this.mostrarLocalFlag = true;
        return true;
      }
      if (this.isAduana()) {
        this.mostrarAduanaFlag = true;
        return true;
      }
      if (this.isFlete() && !this.isImport()) {
        this.mostrarFleteExportFlag = true;
        return true;
      }

      if (this.isAlmacen()) {
        this.mostrarAlmacenFlag = true;
        return true;
      }
      if (this.isGastosTercero()) {
        this.mostrarGastosTercerosFlag = true;
        return true;
      }
    },
    async comprobarLocal() {
      this.valores
        .filter((v) => v.eslocalflag == 1 && v.status == true)
        .forEach((element) => {
          let res = this.validateCost({ costo: element });

          if (!!res) {
            element.error = "El costo que tiene un valor 0.00.";
          } else {
            element.error = "";
          }
        });
      let val = !this.valores.some(
        (v) => v.eslocalflag == 1 && v.status == true && v.error != ""
      );

      if (val) {
        await this.mostrarSiguienteLocal();
        this.valueLocal = 1;
        this.mostrarBtnLocalFlag = false;
        if (
          !this.mostrarSiguienteLocal() &&
          !this.mostrarSiguienteFleteExport() &&
          !this.mostrarSiguienteAduana()
        ) {
          this.$store.state.pricing.mostrarGuardarCostos = true;
        }
      }
    },
    mostrarSiguienteLocal() {
      if (this.isAduana()) {
        this.mostrarAduanaFlag = true;
        return true;
      }
      if (this.isFlete() && !this.isImport()) {
        this.mostrarFleteExportFlag = true;
        return true;
      }
      if (this.isAlmacen()) {
        this.mostrarAlmacenFlag = true;
        return true;
      }
      if (this.isGastosTercero()) {
        this.mostrarGastosTercerosFlag = true;
        return true;
      }
    },

    async comprobarAduana() {
      this.valores
        .filter((v) => v.esaduanaflag == 1 && v.status == true)
        .forEach((element) => {
          let res = this.validateCost({ costo: element });

          if (!!res) {
            element.error = "El costo que tiene un valor 0.00.";
          } else {
            element.error = "";
          }
        });
      let val = !this.valores.some(
        (v) => v.esaduanaflag == 1 && v.status == true && v.error != ""
      );

      if (val) {
        await this.mostrarSiguienteFleteExport();
        this.valueAduana = 1;
        this.mostrarBtnAduanaFlag = false;
        if (
          !this.mostrarSiguienteFleteExport() &&
          !this.mostrarSiguienteAduana()
        ) {
          this.$store.state.pricing.mostrarGuardarCostos = true;
        }
      }
    },
    mostrarSiguienteAduana() {
      if (this.isFlete() && !this.isImport()) {
        this.mostrarFleteExportFlag = true;
        this.mostrarAlmacenFlag = false;
        return true;
      }

      if (this.isAlmacen()) {
        this.mostrarAlmacenFlag = true;
        return true;
      }
      if (this.isGastosTercero()) {
        this.mostrarGastosTercerosFlag = true;
        return true;
      }
    },

    async comprobarFleteExport() {
      this.valores
        .filter((v) => v.esfleteflag == 1 && v.status == true)
        .forEach((element) => {
          let res = this.validateCost({ costo: element });

          if (!!res) {
            element.error = "El costo que tiene un valor 0.00.";
          } else {
            element.error = "";
          }
        });
      let val = !this.valores.some(
        (v) => v.esfleteflag == 1 && v.status == true && v.error != ""
      );

      if (val) {
        await this.mostrarSiguienteAlmacen();
        this.valueFleteExport = 1;
        this.mostrarBtnFleteExportFlag = false;
        if (!this.mostrarSiguienteAlmacen()) {
          this.$store.state.pricing.mostrarGuardarCostos = true;
        }
      }
    },
    mostrarSiguienteFleteExport() {
      if (this.isFlete() && !this.isImport()) {
        this.mostrarFleteExportFlag = true;
        return true;
      }
      if (this.isAlmacen()) {
        this.mostrarAlmacenFlag = true;
        return true;
      }
      if (this.isGastosTercero()) {
        this.mostrarGastosTercerosFlag = true;
        return true;
      }
    },
    mostrarSiguienteAlmacen() {
      if (this.isAlmacen()) {
        this.mostrarAlmacenFlag = true;
        return true;
      }
      if (this.isGastosTercero()) {
        this.mostrarGastosTercerosFlag = true;
        return true;
      }
    },
    async comprobarAlmacen() {
      this.valores
        .filter((v) => v.esalmacenflag == 1 && v.status == true)
        .forEach((element) => {
          let res = this.validateCost({ costo: element });

          if (!!res) {
            element.error = "El costo que tiene un valor 0.00.";
          } else {
            element.error = "";
          }
        });
      let val = !this.valores.some(
        (v) => v.esalmacenflag == 1 && v.status == true && v.error != ""
      );

      if (val) {
        await this.mostrarSiguienteGastosTercero();
        this.valueAlmacen = 1;
        this.mostrarBtnAlmacenFlag = false;
        if (!this.mostrarSiguienteGastosTercero()) {
          this.$store.state.pricing.mostrarGuardarCostos = true;
        }
      }
    },

    mostrarSiguienteGastosTercero() {
      if (this.isGastosTercero()) {
        this.mostrarGastosTercerosFlag = true;
        return true;
      }
    },

    async comprobarGastosTerceros() {
      this.valores
        .filter((v) => v.esgastostercerosflag == 1 && v.status == true)
        .forEach((element) => {
          let res = this.validateCost({ costo: element });

          if (!!res) {
            element.error = "El costo que tiene un valor 0.00.";
          } else {
            element.error = "";
          }
        });
      let val = !this.valores.some(
        (v) => v.esgastostercerosflag == 1 && v.status == true && v.error != ""
      );
      if (val) {
        this.valueGastosTerceros = 1;
        this.mostrarBtnGastosTercerosFlag = false;
        this.$store.state.pricing.mostrarGuardarCostos = true;
      }
    },

    // mostrarGuardarCostosF() {

    //   if (!this.valores.some((v) => v.status == true && v.error != "")) {
    //     this.$store.state.pricing.mostrarGuardarCostos = true;
    //   }
    // },
    validateCost({ costo }) {
      let service = this.$store.state.pricing.listServices.filter(
        (v) => v.status == 1
      );
      let multiplocadores = this.$store.state.pricing.listMultiplicador.filter(
        (v) => {
          return this.comienzaNoConCaracter(v.text, "%");
        }
      );
      let idMultiplicador = multiplocadores.map((v) => v.id);
      let idServices = service.map((v) => v.id_groupservices);
      if (
        !!idMultiplicador.includes(costo.id_multiplicador) &&
        !!idServices.includes(costo.id_groupservices) &&
        !!(costo.costounitario == 0)
      ) {
        return true;
      } else {
        return false;
      }
    },
    eliminarCostos({ costo = null }) {
      costo.status = 0;
      this.$store.state.pricing.listCostos =
        this.$store.state.pricing.listCostos.filter((v) => v.status == 1);
      setTimeout(() => {
        this.calcTotales();
      }, 10);
    },

    async calcTotales() {
      setTimeout(async () => {
        // this.$store.state.pricing.totalFlete = 0.0;
        await this.calcularTotalesFlete();
        await this.calcularTotalesNoFlete();
        await this.calcTotal();
      }, 100);
    },
    calcularTotalesFlete() {
      this.totalOption = 0;
      this.resumenOpcion = {
        flete: 0,
        origen: 0,
        gasto: 0,
        aduana: 0,
        almacen: 0,
        gastostercero: 0,
      };

      if (this.isFlete()) {
        this.valores
          .filter(
            (v) => v.esfleteflag == 1 && v.status == 1 && v.esopcionflag == 1
          )
          .forEach((element) => {
            if (this.isNotPorcentaje(element, element.id_multiplicador)) {
              this.resumenOpcion.flete +=
                (this.$store.state.pricing.listMultiplicador.filter(
                  (v) => v.id == element.id_multiplicador
                ).length > 0
                  ? this.$store.state.pricing.listMultiplicador.filter(
                      (v) => v.id == element.id_multiplicador
                    )[0].valor
                  : 0) *
                element.costounitario *
                this.calcularFac(
                  this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador
                      )[0].code
                    : "N",
                  this.$store.state.pricing.datosPrincipales.volumen,
                  this.$store.state.pricing.datosPrincipales.peso,
                  this.$store.state.pricing.datosPrincipales.containers,
                  this.$store.state.pricing.datosPrincipales.amount
                );
            } else {
              this.resumenOpcion.flete += this.calcularValor(
                this.$store.state.pricing.datosPrincipales.amount,
                this.$store.state.pricing.totalFlete,
                this.$store.state.pricing.listMultiplicador.filter(
                  (v) => v.id == element.id_multiplicador
                ).length > 0
                  ? this.$store.state.pricing.listMultiplicador.filter(
                      (v) => v.id == element.id_multiplicador
                    )[0].code
                  : "",
                this.$store.state.pricing.listMultiplicador.some(
                  (v) =>
                    v.id == element.id_multiplicador &&
                    (v.code == 14 || v.code == 13 || v.code == 5)
                )
                  ? this.$store.state.pricing.listMultiplicador.some(
                      (v) =>
                        v.id == element.id_multiplicador &&
                        (v.code == 14 || v.code == 13)
                    )
                    ? element.cif
                    : element.seguro
                  : 0
              );
            }
          });
      }
    },
    calcularTotalesNoFlete() {
      this.resumenOpcion = {
        flete: this.resumenOpcion.flete,
        origen: 0,
        gasto: 0,
        aduana: 0,
        almacen: 0,
        gastostercero: 0,
      };
      this.valores
        .filter((v) => v.status == 1)
        .forEach((element) => {
          //   GASTOS
          if (this.isOrigen()) {
            if (element.esorigenflag == 1) {
              if (this.isNotPorcentaje(element, element.id_multiplicador)) {
                this.resumenOpcion.origen +=
                  (this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador
                      )[0].valor
                    : 0) *
                  element.costounitario *
                  this.calcularFac(
                    this.$store.state.pricing.listMultiplicador.filter(
                      (v) => v.id == element.id_multiplicador
                    ).length > 0
                      ? this.$store.state.pricing.listMultiplicador.filter(
                          (v) => v.id == element.id_multiplicador
                        )[0].code
                      : "N",
                    this.$store.state.pricing.datosPrincipales.volumen,
                    this.$store.state.pricing.datosPrincipales.peso,
                    this.$store.state.pricing.datosPrincipales.containers,
                    this.$store.state.pricing.datosPrincipales.amount
                  );
              } else {
                this.resumenOpcion.origen += this.calcularValor(
                  this.$store.state.pricing.datosPrincipales.amount,
                  this.$store.state.pricing.totalFlete,
                  this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador
                      )[0].code
                    : "",
                  this.$store.state.pricing.listMultiplicador.some(
                    (v) =>
                      v.id == element.id_multiplicador &&
                      (v.code == 14 || v.code == 13 || v.code == 5)
                  )
                    ? this.$store.state.pricing.listMultiplicador.some(
                        (v) =>
                          v.id == element.id_multiplicador &&
                          (v.code == 14 || v.code == 13)
                      )
                      ? element.cif
                      : element.seguro
                    : 0
                );
              }
            }
          }
          if (this.isLocal()) {
            if (element.eslocalflag == 1) {
              if (this.isNotPorcentaje(element, element.id_multiplicador)) {
                this.resumenOpcion.gasto +=
                  (this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador
                      )[0].valor
                    : 0) *
                  element.costounitario *
                  this.calcularFac(
                    this.$store.state.pricing.listMultiplicador.filter(
                      (v) => v.id == element.id_multiplicador
                    ).length > 0
                      ? this.$store.state.pricing.listMultiplicador.filter(
                          (v) => v.id == element.id_multiplicador
                        )[0].code
                      : "N",
                    this.$store.state.pricing.datosPrincipales.volumen,
                    this.$store.state.pricing.datosPrincipales.peso,
                    this.$store.state.pricing.datosPrincipales.containers,
                    this.$store.state.pricing.datosPrincipales.amount
                  );
              } else {
                this.resumenOpcion.gasto += this.calcularValor(
                  this.$store.state.pricing.datosPrincipales.amount,
                  this.$store.state.pricing.totalFlete,
                  this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador
                      )[0].code
                    : "",
                  this.$store.state.pricing.listMultiplicador.some(
                    (v) =>
                      v.id == element.id_multiplicador &&
                      (v.code == 14 || v.code == 13 || v.code == 5)
                  )
                    ? this.$store.state.pricing.listMultiplicador.some(
                        (v) =>
                          v.id == element.id_multiplicador &&
                          (v.code == 14 || v.code == 13)
                      )
                      ? element.cif
                      : element.seguro
                    : 0
                );
              }
            }
          }
          //   ADUANA
          if (this.isAduana()) {
            if (element.esaduanaflag == 1) {
              if (this.isNotPorcentaje(element, element.id_multiplicador)) {
                this.resumenOpcion.aduana +=
                  (this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador
                      )[0].valor
                    : 0) *
                  element.costounitario *
                  this.calcularFac(
                    this.$store.state.pricing.listMultiplicador.filter(
                      (v) => v.id == element.id_multiplicador
                    ).length > 0
                      ? this.$store.state.pricing.listMultiplicador.filter(
                          (v) => v.id == element.id_multiplicador
                        )[0].code
                      : "N",
                    this.$store.state.pricing.datosPrincipales.volumen,
                    this.$store.state.pricing.datosPrincipales.peso,
                    this.$store.state.pricing.datosPrincipales.containers,
                    this.$store.state.pricing.datosPrincipales.amount
                  );
              } else {
                this.resumenOpcion.aduana += this.calcularValor(
                  this.$store.state.pricing.datosPrincipales.amount,
                  this.$store.state.pricing.totalFlete,
                  this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador
                      )[0].code
                    : "",
                  this.$store.state.pricing.listMultiplicador.some(
                    (v) =>
                      v.id == element.id_multiplicador &&
                      (v.code == 14 || v.code == 13 || v.code == 5)
                  )
                    ? this.$store.state.pricing.listMultiplicador.some(
                        (v) =>
                          v.id == element.id_multiplicador &&
                          (v.code == 14 || v.code == 13)
                      )
                      ? element.cif
                      : element.seguro
                    : 0
                );
              }
            }
          }
          //   ALMACEN
          if (this.isAlmacen()) {
            if (element.esalmacenflag == 1) {
              if (this.isNotPorcentaje(element, element.id_multiplicador)) {
                this.resumenOpcion.almacen +=
                  (this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador
                      )[0].valor
                    : 0) *
                  element.costounitario *
                  this.calcularFac(
                    this.$store.state.pricing.listMultiplicador.filter(
                      (v) => v.id == element.id_multiplicador
                    ).length > 0
                      ? this.$store.state.pricing.listMultiplicador.filter(
                          (v) => v.id == element.id_multiplicador
                        )[0].code
                      : "N",
                    this.$store.state.pricing.datosPrincipales.volumen,
                    this.$store.state.pricing.datosPrincipales.peso,
                    this.$store.state.pricing.datosPrincipales.containers,
                    this.$store.state.pricing.datosPrincipales.amount
                  );
              } else {
                this.resumenOpcion.almacen += this.calcularValor(
                  this.$store.state.pricing.datosPrincipales.amount,
                  this.$store.state.pricing.totalFlete,
                  this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador
                      )[0].code
                    : "",
                  this.$store.state.pricing.listMultiplicador.some(
                    (v) =>
                      v.id == element.id_multiplicador &&
                      (v.code == 14 || v.code == 13 || v.code == 5)
                  )
                    ? this.$store.state.pricing.listMultiplicador.some(
                        (v) =>
                          v.id == element.id_multiplicador &&
                          (v.code == 14 || v.code == 13)
                      )
                      ? element.cif
                      : element.seguro
                    : 0
                );
              }
            }
          }
          //   GASTOS DE TERCEROS
          if (this.isGastosTercero()) {
            if (element.esgastostercerosflag == 1) {
              if (this.isNotPorcentaje(element, element.id_multiplicador)) {
                this.resumenOpcion.gastostercero +=
                  (this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador
                      )[0].valor
                    : 0) *
                  element.costounitario *
                  this.calcularFac(
                    this.$store.state.pricing.listMultiplicador.filter(
                      (v) => v.id == element.id_multiplicador
                    ).length > 0
                      ? this.$store.state.pricing.listMultiplicador.filter(
                          (v) => v.id == element.id_multiplicador
                        )[0].code
                      : "N",
                    this.$store.state.pricing.datosPrincipales.volumen,
                    this.$store.state.pricing.datosPrincipales.peso,
                    this.$store.state.pricing.datosPrincipales.containers,
                    this.$store.state.pricing.datosPrincipales.amount
                  );
              } else {
                this.resumenOpcion.gastostercero += this.calcularValor(
                  this.$store.state.pricing.datosPrincipales.amount,
                  this.$store.state.pricing.totalFlete,
                  this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador
                      )[0].code
                    : "",
                  this.$store.state.pricing.listMultiplicador.some(
                    (v) =>
                      v.id == element.id_multiplicador &&
                      (v.code == 14 || v.code == 13 || v.code == 5)
                  )
                    ? this.$store.state.pricing.listMultiplicador.some(
                        (v) =>
                          v.id == element.id_multiplicador &&
                          (v.code == 14 || v.code == 13)
                      )
                      ? element.cif
                      : element.seguro
                    : 0
                );
              }
            }
          }
        });
    },
    calcTotal() {
      this.totalOption = 0;
      this.totalOption =
        this.resumenOpcion.flete +
        this.resumenOpcion.gasto +
        this.resumenOpcion.aduana +
        this.resumenOpcion.origen +
        this.resumenOpcion.almacen +
        this.resumenOpcion.gastostercero;

      this.$store.state.pricing.totalCosto = this.totalOption;
      // this.setTotalOpcion(valores);
    },
    cerrarModalNuevoCosto() {
      // this.$refs.frmNuevoCosto.reset();
      this.dialog = !this.dialog;
    },
    guardarCosto() {
      if (this.fromDataService.idOpcion == "FL") {
        this.fromDataService.esfleteflag = 1;
        if (this.isImport()) {
          this.mostrarFleteImportFlag = true;
          this.mostrarBtnFleteImportFlag =
            this.mostrarBtnOrigenFlag ||
            this.mostrarBtnLocalFlag ||
            this.mostrarBtnAduanaFlag ||
            this.mostrarBtnAlmacenFlag ||
            this.mostrarBtnGastosTercerosFlag ||
            this.$store.state.pricing.mostrarGuardarCostos ||
            !this.$store.state.pricing.llenadoCostos
              ? false
              : true;
        } else {
          this.mostrarFleteExportFlag = true;
          this.mostrarBtnFleteExportFlag =
            this.mostrarBtnAlmacenFlag ||
            this.mostrarBtnGastosTercerosFlag ||
            this.$store.state.pricing.mostrarGuardarCostos ||
            !this.$store.state.pricing.llenadoCostos
              ? false
              : true;
        }
      }
      if (this.$refs.frmNuevoCosto.validate()) {
        if (this.fromDataService.idOpcion == "OR") {
          this.fromDataService.esorigenflag = 1;
          this.mostrarOrigenFlag = true;
          this.mostrarBtnOrigenFlag =
            this.mostrarBtnLocalFlag ||
            this.mostrarBtnAduanaFlag ||
            this.mostrarBtnFleteExportFlag ||
            this.mostrarBtnAlmacenFlag ||
            this.mostrarBtnGastosTercerosFlag ||
            this.$store.state.pricing.mostrarGuardarCostos ||
            !this.$store.state.pricing.llenadoCostos
              ? false
              : true;
        }
        if (this.fromDataService.idOpcion == "LO") {
          this.fromDataService.eslocalflag = 1;
          this.mostrarLocalFlag = true;
          this.mostrarBtnLocalFlag =
            this.mostrarBtnAduanaFlag ||
            this.mostrarBtnFleteExportFlag ||
            this.mostrarBtnAlmacenFlag ||
            this.mostrarBtnGastosTercerosFlag ||
            this.$store.state.pricing.mostrarGuardarCostos ||
            !this.$store.state.pricing.llenadoCostos
              ? false
              : true;
        }
        if (this.fromDataService.idOpcion == "AD") {
          this.fromDataService.esaduanaflag = 1;
          this.mostrarAduanaFlag = true;
          this.mostrarBtnAduanaFlag =
            this.mostrarBtnFleteExportFlag ||
            this.mostrarBtnAlmacenFlag ||
            this.mostrarBtnGastosTercerosFlag ||
            this.$store.state.pricing.mostrarGuardarCostos ||
            !this.$store.state.pricing.llenadoCostos
              ? false
              : true;
        }
        if (this.fromDataService.idOpcion == "AL") {
          this.fromDataService.esalmacenflag = 1;
          this.mostrarAlmacenFlag = true;
          this.mostrarBtnAlmacenFlag =
            this.mostrarBtnGastosTercerosFlag ||
            this.$store.state.pricing.mostrarGuardarCostos ||
            !this.$store.state.pricing.llenadoCostos
              ? false
              : true;
        }

        if (this.fromDataService.idOpcion == "GT") {
          this.fromDataService.esgastostercerosflag = 1;
          this.mostrarGastosTercerosFlag = true;
          this.mostrarBtnGastosTercerosFlag =
            this.$store.state.pricing ||
            this.$store.state.pricing.llenadoCostos.mostrarGuardarCostos ||
            !this.$store.state.pricing.llenadoCostos
              ? false
              : true;
        }
        this.$store.state.pricing.opcionCostos
          .filter((v) => v.nro_propuesta == this.valores[0].nro_propuesta)[0]
          .listCostos.push(this.fromDataService);

        this.dialog = !this.dialog;
        /*
        if (this.$store.state.pricing.mostrarGuardarCostos) {
          this.mostrarFleteImportFlag = this.valores.some(
            (v) => v.esfleteflag && this.isImport()
          );
          this.mostrarOrigenFlag = this.valores.some((v) => v.origen);
          this.mostrarLocalFlag = this.valores.some((v) => v.eslocalflag);
          this.mostrarAduanaFlag = this.valores.some((v) => v.esaduanaflag);
          this.mostrarFleteExportFlag = this.valores.some(
            (v) => v.esfleteflag && !this.isImport()
          );
          this.mostrarAlmacenFlag = this.valores.some((v) => v.almacen);
          this.mostrarGastosTercerosFlag = this.valores.some(
            (v) => v.esgastostercerosflag
          );
        }
        */
        // this.habilidarCuandoYaHayOpciones();
        this.calcTotales();
      }
    },
    isNotPorcentaje(element, id_multiplicador) {
      let code = [5, 13, 14];

      let mul = this.$store.state.pricing.listMultiplicador.some(
        (v) => v.id == id_multiplicador && code.includes(v.code)
      );

      return !mul;
    },
    abrirModal() {
      this.dialog = !this.dialog;
      this.limpiar();
    },

    mostrarFleteImport() {
      return this.isImport() && this.mostrarFleteImportFlag;
    },
    mostrarOrigen() {
      return this.mostrarOrigenFlag;
    },
    mostrarLocal() {
      return this.mostrarLocalFlag;
    },
    mostrarAduana() {
      return this.mostrarAduanaFlag;
    },
    mostrarFleteExport() {
      return !this.isImport() && this.mostrarFleteExportFlag;
    },
    mostrarAlmacen() {
      return this.mostrarAlmacenFlag;
    },
    mostrarGastosTerceros() {
      return this.mostrarGastosTercerosFlag;
    },

    isFlete() {
      let val = this.valores.some(
        (v) => v.esfleteflag == 1 && v.status == true
      );

      return val;
    },

    isOrigen() {
      let val = this.valores.some(
        (v) => v.esorigenflag == 1 && v.status == true
      );

      return val;
    },

    isLocal() {
      let val = this.valores.some(
        (v) => v.eslocalflag == 1 && v.status == true
      );
      return val;
    },

    isAduana() {
      let val = this.valores.some(
        (v) => v.esaduanaflag == 1 && v.status == true
      );
      return val;
    },

    isGastosTercero() {
      let val = this.valores.some(
        (v) => v.esgastostercerosflag == 1 && v.status == true
      );
      return val;
    },
    isAlmacen() {
      let val = this.valores.some(
        (v) => v.esalmacenflag == 1 && v.status == true
      );
      return val;
    },
    isConfeccion(code) {
      return code == 33 ? true : false;
    },

    montoConfeccion(item) {
      let monto = 0;
      if (item.code_cost == 33) {
        let amount = this.$store.state.pricing.datosPrincipales.amount;
        let cif =
          parseFloat(amount) +
          parseFloat(this.$store.state.pricing.totalFlete) +
          (parseFloat(amount) +
            parseFloat(this.$store.state.pricing.totalFlete)) *
            0.01;

        if (cif < 5000) {
          monto = 50;
        }
        if (cif >= 5000 && cif < 10000) {
          monto = 80;
        }
        if (cif >= 10000) {
          monto = 80 + parseFloat(cif * 0.0025);
        }
      }

      item.costounitario = parseFloat(monto).toFixed(2);
      return this.currencyFormat(monto);
    },
    isITBM(code) {
      return code == 38 ? true : false;
    },
    montoITBM(item) {
      let monto = 0;
      let code = [29, 36, 41, 68];
      if (item.code_cost == 38) {
        let val = this.valores.filter((v) => code.includes(v.code_cost));
        val.forEach((element) => {
          monto += parseFloat(
            (this.$store.state.pricing.listMultiplicador.some(
              (v) => v.id == element.id_multiplicador
            )
              ? this.$store.state.pricing.listMultiplicador.filter(
                  (v) => v.id == element.id_multiplicador
                )[0].valor
              : 0) *
              element.costounitario *
              this.calcularFac(
                this.$store.state.pricing.listMultiplicador.some(
                  (v) => v.id == element.id_multiplicador
                )
                  ? this.$store.state.pricing.listMultiplicador.filter(
                      (v) => v.id == element.id_multiplicador
                    )[0].code
                  : "N",
                this.$store.state.pricing.datosPrincipales.volumen,
                this.$store.state.pricing.datosPrincipales.peso,
                this.$store.state.pricing.datosPrincipales.containers,
                this.$store.state.pricing.datosPrincipales.amount
              )
          );
        });
      }
      item.costounitario = parseFloat(monto * 0.07).toFixed(2);
      return this.currencyFormat(parseFloat(monto * 0.07).toFixed(2));
    },
    isNotaCredito(code) {
      return code == 69 ? true : false;
    },
    montoNotaCredito(item) {
      let monto = 0;
      let code = [33];
      if (item.code_cost == 69) {
        let val = this.valores.filter((v) => code.includes(v.code_cost));
        val.forEach((element) => {
          monto = element.costounitario;
        });
      }
      item.costounitario = -1 * parseFloat(monto * 0.5).toFixed(2);
      return this.currencyFormat(-1 * parseFloat(monto * 0.5).toFixed(2));
    },
    limpiar() {
      this.fromDataService = {
        ventaFlag: 0,
        esopcionflag: 1,
        id_begend: 0,
        costounitario: "",
        esorigenflag: 0,
        eslocalflag: 0,
        esaduanaflag: 0,
        esalmacenflag: 0,
        seguro: 0,
        cif: 0,
        esventaflag: 0,
        status: 1,
        id_groupservices: 0,
        id_multiplicador: 0,
        id_proveedor: 0,
      };
    },
    isImport() {
      return this.$store.state.pricing.listModality.some(
        (v) =>
          v.id == this.$store.state.pricing.datosPrincipales.idsentido &&
          v.code == "I"
      );
    },
    mostrarAdvertencia(data) {
      return data.some(
        (v) => v.status == 1 && v.error != null && v.error !== ""
      );
    },
  },
  watch: {
    valores() {
      this.calcTotales();
      // console.log("valores");
    },
    actualizarCostosFlag() {
      this.calcTotales();
    },
    amount() {
      this.calcTotales();
    },
    cancelarLlenadoNuevaOpcion() {
      // this.habilidarPrimeraAccion();
      this.mostrarSiguienteFleteImport();
      this.mostrarSiguienteOrigen();
      this.mostrarSiguienteLocal();
      this.mostrarSiguienteAduana();
      this.mostrarSiguienteFleteExport();
      this.valueFleteImport = 1;
      this.valueOrigen = 1;
      this.valueLocal = 1;
      this.valueAduana = 1;
      this.valueAlmacen = 1;
      this.valueFleteExport = 1;
      this.mostrarBtnFleteImportFlag = false;
      this.mostrarBtnOrigenFlag = false;
      this.mostrarBtnLocalFlag = false;
      this.mostrarBtnAduanaFlag = false;
      this.mostrarBtnFleteExportFlag = false;
      this.mostrarBtnAlmacenFlag = false;
      this.$store.state.pricing.mostrarGuardarCostos = true;
    },
    totalFlete() {
      this.calcTotales();
    },
    idProveedor() {
      console.log("idProveedor", this.idProveedor);
    },
  },
  computed: {
    cancelarLlenadoNuevaOpcion: {
      get() {
        return this.$store.state.pricing.cancelarLlenadoNuevaOpcion;
      },
      set(val) {
        return (this.$store.state.pricing.cancelarLlenadoNuevaOpcion =
          cancelarLlenadoNuevaOpcion);
      },
    },
    totalFlete: {
      get() {
        return this.$store.state.pricing.totalFlete;
      },
      set(val) {
        return (this.$store.state.pricing.totalFlete = totalFlete);
      },
    },
  },
};
</script>

<style scoped>
.v-expansion-panels.condensed
  .v-expansion-panel-header
  .v-expansion-panel-content__wrap {
  /* padding-top: 2px;
  padding-bottom: 2px; */
  /* padding: 2px 8px 2px; */
  min-height: auto;
}
.widthTD {
  max-width: 180px !important;
  padding: 0 18px !important;
}

.btnAccion {
  width: 5% !important;
  max-width: 5% !important;
}

.colProveedorMultiplicador {
  width: 20% !important;
  max-width: 20% !important;
}
.colConcepto {
  width: 35% !important;
  max-width: 35% !important;
  min-width: 35% !important;
}
.colCostos {
  width: 10% !important;
  max-width: 10% !important;
}

/* .tdMontos {
  width:  !important; 
} */

td {
  padding: 0 3px !important;
}
.derecha {
  text-align: right !important;
  align-content: right !important;
}
.v-text-field__slot {
  max-width: 5px !important;
}

table td:nth-child(5) {
  align-content: right !important;
  text-align: right !important;
  max-width: 90px !important;
  min-width: 90px !important;
}
table td:nth-child(6) {
  align-content: right !important;
  text-align: right !important;
  max-width: 90px !important;
  min-width: 90px !important;
}

.expansion {
  background: salmon !important;
  /* padding: 0 8px 16px !important; */
}

.v-expansion-panel-content >>> .v-expansion-panel-content__wrap {
  padding: 0px !important;
}
</style>
