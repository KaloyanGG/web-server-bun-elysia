import { t } from "elysia";
import { responseLocationDTO } from "./location.dtos";

export const CreateHolidayDTO = t.Object({
    location: t.Numeric(),
    title: t.Optional(t.String()),
    startDate: t.Optional(t.String()),
    duration: t.Optional(t.Integer()),
    price: t.Optional(t.Numeric()),
    freeSlots: t.Optional(t.Integer()),
});

export const ResponseHolidayDTO = t.Object({
    id: t.Integer(),
    location: responseLocationDTO,
    title: t.Optional(t.String()),
    startDate: t.Optional(t.String()),
    duration: t.Optional(t.Integer()),
    price: t.Optional(t.Number()),
    freeSlots: t.Optional(t.Integer()),
});

export const UpdateHolidayDTO = t.Object({
    id: t.Integer(),
    location: t.Optional(t.Integer()),
    title: t.Optional(t.String()),
    startDate: t.Optional(t.String()),
    duration: t.Optional(t.Integer()),
    price: t.Optional(t.Number()),
    freeSlots: t.Optional(t.Integer()),
});