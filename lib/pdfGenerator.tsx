import React from 'react'
import { Document, Page, Text, View, StyleSheet, pdf, Font, Image } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { SalaryBreakdown } from './salaryCalculator'

// Jobsmato Logo
// Source asset is also kept at `public/jobsmato-logo.svg`.
// Note: react-pdf Image support for SVG URLs can be inconsistent; a data URI is the most reliable option.
const JOBSMATO_LOGO = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAyIiBoZWlnaHQ9IjE4NSIgdmlld0JveD0iMCAwIDUwMiAxODUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDIiIGhlaWdodD0iMTg1IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTQ0LjUyOCAxMzMuNjUyQzE0My4wODEgMTMzLjY1MiAxNDEuODE1IDEzMy41NjggMTQwLjcyOSAxMzMuMzk5QzEzOS42MTkgMTMzLjI1NSAxMzguNjc5IDEzMy4wNzQgMTM3LjkwNyAxMzIuODU3VjEyMy41MzVDMTM4LjY3OSAxMjMuNzA0IDEzOS41MTEgMTIzLjg2IDE0MC40MDQgMTI0LjAwNUMxNDEuMjcyIDEyNC4xNzQgMTQyLjIwMSAxMjQuMjU4IDE0My4xOSAxMjQuMjU4QzE0NC40OTIgMTI0LjI1OCAxNDUuNjYyIDEyNC4wMDUgMTQ2LjY5OSAxMjMuNDk5QzE0Ny43MzcgMTIzLjAxNyAxNDguNTU3IDEyMi4wOSAxNDkuMTYgMTIwLjcxN0MxNDkuNzYzIDExOS4zNDQgMTUwLjA2NSAxMTcuMzY5IDE1MC4wNjUgMTE0Ljc5MVY2NS4yODlIMTYxLjI4MVYxMTQuNzE5QzE2MS4yODEgMTE5LjI0NyAxNjAuNTcgMTIyLjg5NyAxNTkuMTQ3IDEyNS42NjdDMTU3Ljc0OCAxMjguNDYxIDE1NS43ODIgMTMwLjQ4NSAxNTMuMjQ5IDEzMS43MzdDMTUwLjc0IDEzMy4wMTQgMTQ3LjgzMyAxMzMuNjUyIDE0NC41MjggMTMzLjY1MlpNMjA5LjAwOSA5Ny44NDQ4QzIwOS4wMDkgMTAxLjIxNyAyMDguNTUxIDEwNC4yMDQgMjA3LjYzNCAxMDYuODA2QzIwNi43NDEgMTA5LjQwNyAyMDUuNDI3IDExMS42MTEgMjAzLjY5IDExMy40MThDMjAxLjk3NyAxMTUuMiAxOTkuOTAyIDExNi41NDkgMTk3LjQ2NyAxMTcuNDY1QzE5NS4wNTQgMTE4LjM4IDE5Mi4zMjggMTE4LjgzOCAxODkuMjg4IDExOC44MzhDMTg2LjQ0MyAxMTguODM4IDE4My44MjUgMTE4LjM4IDE4MS40MzggMTE3LjQ2NUMxNzkuMDc0IDExNi41NDkgMTc3LjAxIDExNS4yIDE3NS4yNSAxMTMuNDE4QzE3My41MTMgMTExLjYxMSAxNzIuMTYyIDEwOS40MDcgMTcxLjE5NyAxMDYuODA2QzE3MC4yNTcgMTA0LjIwNCAxNjkuNzg2IDEwMS4yMTcgMTY5Ljc4NiA5Ny44NDQ4QzE2OS43ODYgOTMuMzY0MiAxNzAuNTgyIDg5LjU3MDMgMTcyLjE3NSA4Ni40NjI5QzE3My43NjcgODMuMzU1NCAxNzYuMDM0IDgwLjk5NDggMTc4Ljk3NyA3OS4zODA4QzE4MS45MTkgNzcuNzY2OSAxODUuNDI5IDc2Ljk2IDE4OS41MDcgNzYuOTZDMTkzLjI5MyA3Ni45NiAxOTYuNjQ2IDc3Ljc2NjkgMTk5LjU2NSA3OS4zODA4QzIwMi41MDggODAuOTk0OCAyMDQuODEyIDgzLjM1NTQgMjA2LjQ3NiA4Ni40NjI5QzIwOC4xNjUgODkuNTcwMyAyMDkuMDA5IDkzLjM2NDIgMjA5LjAwOSA5Ny44NDQ4Wk0xODEuMDM5IDk3Ljg0NDhDMTgxLjAzOSAxMDAuNDk0IDE4MS4zMjggMTAyLjcyMyAxODEuOTA4IDEwNC41MjlDMTgyLjQ4NyAxMDYuMzM2IDE4My4zOTIgMTA3LjY5NyAxODQuNjIxIDEwOC42MTJDMTg1Ljg1MSAxMDkuNTI4IDE4Ny40NTYgMTA5Ljk4NSAxODkuNDM0IDEwOS45ODVDMTkxLjM4OCAxMDkuOTg1IDE5Mi45NjggMTA5LjUyOCAxOTQuMTc0IDEwOC42MTJDMTk1LjQwNCAxMDcuNjk3IDE5Ni4yOTcgMTA2LjMzNiAxOTYuODUxIDEwNC41MjlDMTk3LjQzIDEwMi43MjMgMTk3LjcxOSAxMDAuNDk0IDE5Ny43MTkgOTcuODQ0OEMxOTcuNzE5IDk1LjE3MDkgMTk3LjQzIDkyLjk1NDggMTk2Ljg1MSA5MS4xOTYzQzE5Ni4yOTcgODkuNDEzNyAxOTUuNDA0IDg4LjA3NjggMTk0LjE3NCA4Ny4xODU1QzE5Mi45NDQgODYuMjk0MiAxOTEuMzM5IDg1Ljg0ODcgMTg5LjM2MSA4NS44NDg3QzE4Ni40NDMgODUuODQ4NyAxODQuMzE5IDg2Ljg0ODIgMTgyLjk5MyA4OC44NDc2QzE4MS42OSA5MC44NDY5IDE4MS4wMzkgOTMuODQ2MSAxODEuMDM5IDk3Ljg0NDhaTTIyNy42ODEgNjEuODkyNlY3NC45NzI2QzIyNy42ODEgNzYuNDkwMiAyMjcuNjMzIDc3Ljk5NTcgMjI3LjUzNiA3OS40ODkyQzIyNy40NjMgODAuOTgyNyAyMjcuMzY4IDgyLjEzOSAyMjcuMjQ3IDgyLjk1OEgyMjcuNjgxQzIyOC43NDMgODEuMjk1OSAyMzAuMTkgNzkuODg2NyAyMzIuMDI0IDc4LjczMDRDMjMzLjg1NiA3Ny41NTAxIDIzNi4yMzIgNzYuOTYgMjM5LjE1MiA3Ni45NkMyNDMuNjg3IDc2Ljk2IDI0Ny4zNjUgNzguNzMwNCAyNTAuMTg4IDgyLjI3MTVDMjUzLjAwOSA4NS44MTI1IDI1NC40MiA5MS4wMDM2IDI1NC40MiA5Ny44NDQ4QzI1NC40MiAxMDIuNDQ2IDI1My43NjkgMTA2LjMxMiAyNTIuNDY2IDEwOS40NDNDMjUxLjE2NCAxMTIuNTUxIDI0OS4zNDMgMTE0Ljg5OSAyNDcuMDAzIDExNi40ODlDMjQ0LjY2MyAxMTguMDU1IDI0MS45NDkgMTE4LjgzOCAyMzguODYxIDExOC44MzhDMjM1Ljg5NCAxMTguODM4IDIzMy41NTYgMTE4LjMwOCAyMzEuODQzIDExNy4yNDhDMjMwLjEzIDExNi4xODggMjI4Ljc0MyAxMTQuOTk2IDIyNy42ODEgMTEzLjY3MUgyMjYuOTIyTDIyNS4wNzYgMTE4LjExNUgyMTYuNjQ2VjYxLjg5MjZIMjI3LjY4MVpNMjM1LjYwNSA4NS43NzY0QzIzMy42NzUgODUuNzc2NCAyMzIuMTQzIDg2LjE3MzggMjMxLjAxIDg2Ljk2ODhDMjI5Ljg3NiA4Ny43NjM3IDIyOS4wNDQgODguOTU2MSAyMjguNTE0IDkwLjU0NTlDMjI4LjAwNiA5Mi4xMzU3IDIyNy43MyA5NC4xNDcyIDIyNy42ODEgOTYuNTgwMVY5Ny43NzI1QzIyNy42ODEgMTAxLjY5OSAyMjguMjYgMTA0LjcxIDIyOS40MTkgMTA2LjgwNkMyMzAuNTc2IDEwOC44NzcgMjMyLjY4NiAxMDkuOTEzIDIzNS43NSAxMDkuOTEzQzIzOC4wMTggMTA5LjkxMyAyMzkuODE1IDEwOC44NjUgMjQxLjE0MSAxMDYuNzY5QzI0Mi40OTIgMTA0LjY3NCAyNDMuMTY4IDEwMS42NTEgMjQzLjE2OCA5Ny43MDAyQzI0My4xNjggOTMuNzQ5NyAyNDIuNDkyIDkwLjc3NDggMjQxLjE0MSA4OC43NzU0QzIzOS43OSA4Ni43NzYxIDIzNy45NDUgODUuNzc2NCAyMzUuNjA1IDg1Ljc3NjRaTTI5MC4yODEgMTA2LjExOUMyOTAuMjgxIDEwOC44NjUgMjg5LjYzIDExMS4xOSAyODguMzI2IDExMy4wOTNDMjg3LjA0NyAxMTQuOTcyIDI4NS4xMzEgMTE2LjQwNSAyODIuNTczIDExNy4zOTNDMjgwLjAxNiAxMTguMzU2IDI3Ni44MzIgMTE4LjgzOCAyNzMuMDIgMTE4LjgzOEMyNzAuMTk5IDExOC44MzggMjY3Ljc3NSAxMTguNjU3IDI2NS43NDggMTE4LjI5NkMyNjMuNzQ2IDExNy45MzQgMjYxLjcxOSAxMTcuMzMyIDI1OS42NjkgMTE2LjQ4OVYxMDcuMzg0QzI2MS44NjMgMTA4LjM3MSAyNjQuMjE2IDEwOS4xOSAyNjYuNzI0IDEwOS44NDFDMjY5LjI1OCAxMTAuNDY3IDI3MS40NzcgMTEwLjc4IDI3My4zODIgMTEwLjc4QzI3NS41MyAxMTAuNzggMjc3LjA2MiAxMTAuNDY3IDI3Ny45NzggMTA5Ljg0MUMyNzguOTE5IDEwOS4xOSAyNzkuMzg5IDEwOC4zNDcgMjc5LjM4OSAxMDcuMzEyQzI3OS4zODkgMTA2LjYzNyAyNzkuMTk3IDEwNi4wMzUgMjc4LjgxIDEwNS41MDVDMjc4LjQ0OCAxMDQuOTUxIDI3Ny42NTIgMTA0LjMzNyAyNzYuNDIyIDEwMy42NjJDMjc1LjE5MiAxMDIuOTY0IDI3My4yNjMgMTAyLjA2IDI3MC42MzIgMTAwLjk1MkMyNjguMSA5OS44OTIzIDI2Ni4wMTMgOTguODIwMyAyNjQuMzczIDk3LjczNjNDMjYyLjc1NyA5Ni42NTI0IDI2MS41NSA5NS4zNzU2IDI2MC43NTUgOTMuOTA2M0MyNTkuOTgyIDkyLjQxMjcgMjU5LjU5NiA5MC41MjE4IDI1OS41OTYgODguMjMzNEMyNTkuNTk2IDg0LjQ5OTcgMjYxLjA0NCA4MS42OTMzIDI2My45MzggNzkuODE0NEMyNjYuODU3IDc3LjkxMTQgMjcwLjc1MyA3Ni45NiAyNzUuNjI1IDc2Ljk2QzI3OC4xMzUgNzYuOTYgMjgwLjUyMyA3Ny4yMTI5IDI4Mi43OTEgNzcuNzE4OEMyODUuMDgyIDc4LjIyNDcgMjg3LjQzNCA3OS4wMzE1IDI4OS44NDYgODAuMTM5N0wyODYuNTE3IDg4LjA4ODlDMjg0LjUxNSA4Ny4yMjE2IDI4Mi42MjEgODYuNTExMSAyODAuODM3IDg1Ljk1N0MyNzkuMDc1IDg1LjQwMyAyNzcuMjc4IDg1LjEyNiAyNzUuNDQ0IDg1LjEyNkMyNzMuODI4IDg1LjEyNiAyNzIuNjExIDg1LjM0MjcgMjcxLjc5IDg1Ljc3NjRDMjcwLjk3IDg2LjIxIDI3MC41NjEgODYuODcyNCAyNzAuNTYxIDg3Ljc2MzdDMjcwLjU2MSA4OC40MTQgMjcwLjc2NiA4OC45OTIyIDI3MS4xNzUgODkuNDk4QzI3MS42MDkgOTAuMDAzOSAyNzIuNDMgOTAuNTcgMjczLjYzNiA5MS4xOTYzQzI3NC44NjYgOTEuNzk4NSAyNzYuNjYzIDkyLjU4MTQgMjc5LjAyNyA5My41NDQ5QzI4MS4zMTkgOTQuNDg0MyAyODMuMzA5IDk1LjQ3MTkgMjg0Ljk5OCA5Ni41MDc4QzI4Ni42ODUgOTcuNTE5NSAyODcuOTg5IDk4Ljc4NDEgMjg4LjkwNiAxMDAuMzAyQzI4OS44MjIgMTAxLjc5NSAyOTAuMjgxIDEwMy43MzQgMjkwLjI4MSAxMDYuMTE5Wk0zNDQuOTE4IDc2Ljk2QzM0OS41MDMgNzYuOTYgMzUyLjk2NCA3OC4xNDAzIDM1NS4zMDQgODAuNTAxQzM1Ny42NjcgODIuODM3NiAzNTguODUgODYuNTk1MyAzNTguODUgOTEuNzc0M1YxMTguMTE1SDM0Ny43NzdWOTQuNTIwNUMzNDcuNzc3IDkxLjYyOTkgMzQ3LjI4MiA4OS40NDk5IDM0Ni4yOTMgODcuOTgwNEMzNDUuMzA0IDg2LjUxMTEgMzQzLjc3MiA4NS43NzY0IDM0MS42OTkgODUuNzc2NEMzMzguNzggODUuNzc2NCAzMzYuNzA2IDg2LjgyNDIgMzM1LjQ3NCA4OC45MTk5QzMzNC4yNDQgOTAuOTkxNSAzMzMuNjMgOTMuOTY2NSAzMzMuNjMgOTcuODQ0OFYxMTguMTE1SDMyMi41OTNWOTQuNTIwNUMzMjIuNTkzIDkyLjU5MzUgMzIyLjM3NiA5MC45Nzk0IDMyMS45NDIgODkuNjc4N0MzMjEuNTA5IDg4LjM3NzkgMzIwLjg0NCA4Ny40MDI0IDMxOS45NTIgODYuNzUxOUMzMTkuMDYgODYuMTAxNSAzMTcuOTE0IDg1Ljc3NjQgMzE2LjUxNSA4NS43NzY0QzMxNC40NjQgODUuNzc2NCAzMTIuODQ4IDg2LjI5NDIgMzExLjY2NiA4Ny4zMzAxQzMxMC41MDggODguMzQxNyAzMDkuNjc2IDg5Ljg0NzQgMzA5LjE3IDkxLjg0NjZDMzA4LjY4NyA5My44MjE5IDMwOC40NDYgOTYuMjQyOCAzMDguNDQ2IDk5LjEwOTNWMTE4LjExNUgyOTcuNDFWNzcuNzE4OEgzMDUuODQxTDMwNy4zMjUgODIuODg1N0gzMDcuOTM5QzMwOC43NiA4MS40ODg2IDMwOS43ODQgODAuMzU2NCAzMTEuMDE0IDc5LjQ4OTJDMzEyLjI3IDc4LjYyMiAzMTMuNjQ0IDc3Ljk4MzcgMzE1LjE0IDc3LjU3NDJDMzE2LjYzNSA3Ny4xNjQ4IDMxOC4xNTUgNzYuOTYgMzE5LjY5OSA3Ni45NkMzMjIuNjY2IDc2Ljk2IDMyNS4xNzUgNzcuNDQxNyAzMjcuMjI1IDc4LjQwNTNDMzI5LjI5OSA3OS4zNjg4IDMzMC44OTEgODAuODYyMyAzMzIuMDAxIDgyLjg4NTdIMzMyLjk3OUMzMzQuMTg1IDgwLjgxNDEgMzM1Ljg4NSA3OS4zMDg2IDMzOC4wODEgNzguMzY5MUMzNDAuMyA3Ny40Mjk3IDM0Mi41OCA3Ni45NiAzNDQuOTE4IDc2Ljk2Wk0zODUuMzAxIDc2Ljg4NzdDMzkwLjcyOSA3Ni44ODc3IDM5NC44OSA3OC4wNjggMzk3Ljc4NCA4MC40Mjg3QzQwMC42NzkgODIuNzg5MyA0MDIuMTI3IDg2LjM3ODYgNDAyLjEyNyA5MS4xOTYzVjExOC4xMTVIMzk0LjQyTDM5Mi4yODUgMTEyLjYyM0gzOTEuOTk2QzM5MC44MzcgMTE0LjA2OCAzODkuNjU2IDExNS4yNDkgMzg4LjQ0OSAxMTYuMTY0QzM4Ny4yNDMgMTE3LjA3OSAzODUuODU2IDExNy43NTQgMzg0LjI4NyAxMTguMTg4QzM4Mi43MiAxMTguNjIxIDM4MC44MTQgMTE4LjgzOCAzNzguNTcxIDExOC44MzhDMzc2LjE4MyAxMTguODM4IDM3NC4wMzUgMTE4LjM4IDM3Mi4xMyAxMTcuNDY1QzM3MC4yNDkgMTE2LjU0OSAzNjguNzY2IDExNS4xNTIgMzY3LjY4IDExMy4yNzNDMzY2LjU5NCAxMTEuMzcgMzY2LjA1MiAxMDguOTYyIDM2Ni4wNTIgMTA2LjA0N0MzNjYuMDUyIDEwMS43NTkgMzY3LjU2IDk4LjYwMzUgMzcwLjU3NCA5Ni41ODAxQzM3My41ODkgOTQuNTMyNiAzNzguMTEzIDkzLjQwMDQgMzg0LjE0MyA5My4xODM2TDM5MS4xNjMgOTIuOTY2N1Y5MS4xOTYzQzM5MS4xNjMgODkuMDc2NSAzOTAuNjA4IDg3LjUyMjggMzg5LjQ5OSA4Ni41MzUxQzM4OC4zODkgODUuNTQ3NSAzODYuODQ1IDg1LjA1MzcgMzg0Ljg2NyA4NS4wNTM3QzM4Mi45MTQgODUuMDUzNyAzODAuOTk1IDg1LjMzMDcgMzc5LjExNCA4NS44ODQ4QzM3Ny4yMzIgODYuNDM4OCAzNzUuMzUxIDg3LjEzNzQgMzczLjQ3IDg3Ljk4MDRMMzY5LjgxNCA4MC41MzcyQzM3MS45NjIgNzkuNDA1IDM3NC4zNjIgNzguNTEzNyAzNzcuMDE1IDc3Ljg2MzJDMzc5LjY5MyA3Ny4yMTI5IDM4Mi40NTUgNzYuODg3NyAzODUuMzAxIDc2Ljg4NzdaTTM5MS4xNjMgOTkuMzk4NUwzODYuODk0IDk5LjU0MjlDMzgzLjMyMyA5OS42MzkzIDM4MC44MzkgMTAwLjI3OCAzNzkuNDM5IDEwMS40NThDMzc4LjA2NCAxMDIuNjM4IDM3Ny4zNzcgMTA0LjE5MiAzNzcuMzc3IDEwNi4xMTlDMzc3LjM3NyAxMDcuODA1IDM3Ny44NzIgMTA5LjAxIDM3OC44NjEgMTA5LjczMkMzNzkuODUgMTEwLjQzMSAzODEuMTM5IDExMC43OCAzODIuNzMzIDExMC43OEMzODUuMDk3IDExMC43OCAzODcuMDg2IDExMC4wODIgMzg4LjcwMiAxMDguNjg0QzM5MC4zNDMgMTA3LjI4NyAzOTEuMTYzIDEwNS4zIDM5MS4xNjMgMTAyLjcyM1Y5OS4zOTg1Wk00MjkuMDg1IDExMC4wNThDNDMwLjI5IDExMC4wNTggNDMxLjQ2IDEwOS45MzcgNDMyLjU5NSAxMDkuNjk2QzQzMy43NTIgMTA5LjQ1NSA0MzQuODk4IDEwOS4xNTQgNDM2LjAzMiAxMDguNzkzVjExNi45OTVDNDM0Ljg1MSAxMTcuNTI1IDQzMy4zNzggMTE3Ljk1OSA0MzEuNjE3IDExOC4yOTZDNDI5Ljg4MSAxMTguNjU3IDQyNy45NzUgMTE4LjgzOCA0MjUuOTAxIDExOC44MzhDNDIzLjQ4OCAxMTguODM4IDQyMS4zMTggMTE4LjQ1MiA0MTkuMzg3IDExNy42ODJDNDE3LjQ4MiAxMTYuODg3IDQxNS45NzQgMTE1LjUyNiA0MTQuODY1IDExMy41OTlDNDEzLjc3OSAxMTEuNjQ3IDQxMy4yMzYgMTA4LjkzOCA0MTMuMjM2IDEwNS40NjlWODUuOTkzMUg0MDcuOTU0VjgxLjMzMkw0MTQuMDMzIDc3LjY0NjVMNDE3LjIxNyA2OS4xMTkxSDQyNC4yNzJWNzcuNzE4OEg0MzUuNTk3Vjg1Ljk5MzFINDI0LjI3MlYxMDUuNDY5QzQyNC4yNzIgMTA3LjAxIDQyNC43MDcgMTA4LjE2NyA0MjUuNTc1IDEwOC45MzhDNDI2LjQ2NyAxMDkuNjg0IDQyNy42MzcgMTEwLjA1OCA0MjkuMDg1IDExMC4wNThaTTQ3OS41MjcgOTcuODQ0OEM0NzkuNTI3IDEwMS4yMTcgNDc5LjA2OCAxMDQuMjA0IDQ3OC4xNTIgMTA2LjgwNkM0NzcuMjU4IDEwOS40MDcgNDc1Ljk0NCAxMTEuNjExIDQ3NC4yMDcgMTEzLjQxOEM0NzIuNDk0IDExNS4yIDQ3MC40MiAxMTYuNTQ5IDQ2Ny45ODQgMTE3LjQ2NUM0NjUuNTcxIDExOC4zOCA0NjIuODQ2IDExOC44MzggNDU5LjgwNyAxMTguODM4QzQ1Ni45NTkgMTE4LjgzOCA0NTQuMzQzIDExOC4zOCA0NTEuOTU0IDExNy40NjVDNDQ5LjU5IDExNi41NDkgNDQ3LjUyOCAxMTUuMiA0NDUuNzY3IDExMy40MThDNDQ0LjAyOSAxMTEuNjExIDQ0Mi42OCAxMDkuNDA3IDQ0MS43MTQgMTA2LjgwNkM0NDAuNzczIDEwNC4yMDQgNDQwLjMwMyAxMDEuMjE3IDQ0MC4zMDMgOTcuODQ0OEM0NDAuMzAzIDkzLjM2NDIgNDQxLjEgODkuNTcwMyA0NDIuNjkxIDg2LjQ2MjlDNDQ0LjI4MyA4My4zNTU0IDQ0Ni41NSA4MC45OTQ4IDQ0OS40OTMgNzkuMzgwOEM0NTIuNDM3IDc3Ljc2NjkgNDU1Ljk0NiA3Ni45NiA0NjAuMDIzIDc2Ljk2QzQ2My44MTEgNzYuOTYgNDY3LjE2MyA3Ny43NjY5IDQ3MC4wODMgNzkuMzgwOEM0NzMuMDI2IDgwLjk5NDggNDc1LjMyOCA4My4zNTU0IDQ3Ni45OTMgODYuNDYyOUM0NzguNjgyIDg5LjU3MDMgNDc5LjUyNyA5My4zNjQyIDQ3OS41MjcgOTcuODQ0OFpNNDUxLjU1NyA5Ny44NDQ4QzQ1MS41NTcgMTAwLjQ5NCA0NTEuODQ2IDEwMi43MjMgNDUyLjQyNSAxMDQuNTI5QzQ1My4wMDMgMTA2LjMzNiA0NTMuOTA4IDEwNy42OTcgNDU1LjEzOCAxMDguNjEyQzQ1Ni4zNjkgMTA5LjUyOCA0NTcuOTcyIDEwOS45ODUgNDU5Ljk1IDEwOS45ODVDNDYxLjkwNCAxMDkuOTg1IDQ2My40ODUgMTA5LjUyOCA0NjQuNjkgMTA4LjYxMkM0NjUuOTIyIDEwNy42OTcgNDY2LjgxNCAxMDYuMzM2IDQ2Ny4zNjggMTA0LjUyOUM0NjcuOTQ4IDEwMi43MjMgNDY4LjIzNyAxMDAuNDk0IDQ2OC4yMzcgOTcuODQ0OEM0NjguMjM3IDk1LjE3MDkgNDY3Ljk0OCA5Mi45NTQ4IDQ2Ny4zNjggOTEuMTk2M0M0NjYuODE0IDg5LjQxMzcgNDY1LjkyMiA4OC4wNzY4IDQ2NC42OSA4Ny4xODU1QzQ2My40NiA4Ni4yOTQyIDQ2MS44NTcgODUuODQ4NyA0NTkuODc5IDg1Ljg0ODdDNDU2Ljk1OSA4NS44NDg3IDQ1NC44MzcgODYuODQ4MiA0NTMuNTExIDg4Ljg0NzZDNDUyLjIwOCA5MC44NDY5IDQ1MS41NTcgOTMuODQ2MSA0NTEuNTU3IDk3Ljg0NDhaIiBmaWxsPSIjMzQ1NkY1Ii8+CjxwYXRoIGQ9Ik04OC4wNzY4IDg2Ljk3NTRDODguMDc2OCA4Ni40MDUzIDg4LjMwODMgODUuODU5NyA4OC43MTgzIDg1LjQ2MzFMMTAxLjQwNCA3My4xOTEyQzEwMi43NDEgNzEuODk3MiAxMDQuOTggNzIuODQzNyAxMDQuOTggNzQuNzAzN1YxMTguMDc0QzEwNC45OCAxMTkuOTY2IDEwMi42NzYgMTIwLjg5OCAxMDEuMzU3IDExOS41NEw4OC42NzE3IDEwNi40NzZDODguMjkwMiAxMDYuMDgzIDg4LjA3NjggMTA1LjU1OCA4OC4wNzY4IDEwNS4wMVY4Ni45NzU0WiIgZmlsbD0iIzM0NTZGNSIvPgo8cGF0aCBkPSJNNTguMDA2OSA4MC42NTE3QzU4LjAwNjkgODAuMDk5IDU3Ljc4OTEgNzkuNTY4MyA1Ny40MDA4IDc5LjE3NDRMNDQuNzE1MyA2Ni4zMDg4QzQzLjM5MTcgNjQuOTY2NCA0MS4xMDQyIDY1LjkwMjQgNDEuMTA0MiA2Ny43ODYxVjExMS4xMjlDNDEuMTA0MiAxMTIuOTk2IDQzLjM1NjcgMTEzLjk0IDQ0LjY5MDQgMTEyLjYzMkw1Ny4zNzU5IDEwMC4xODhDNTcuNzc5NCA5OS43OTIzIDU4LjAwNjkgOTkuMjUwOSA1OC4wMDY5IDk4LjY4NlY4MC42NTE3WiIgZmlsbD0iIzM0NTZGNSIvPgo8cGF0aCBkPSJNMTAxLjQzIDQwLjYxNzVDMTAyLjc1OSAzOS4yOTI0IDEwNS4wMjkgNDAuMjMyMiAxMDUuMDI5IDQyLjEwNzRWNjIuNTYwMkMxMDUuMDI5IDYzLjExODYgMTA0LjgwNyA2My42NTQxIDEwNC40MTEgNjQuMDQ5TDgzLjc5NjkgODQuNjM0N0M4My40MDE0IDg1LjAyOTYgODMuMTc5MyA4NS41NjUxIDgzLjE3OTMgODYuMTIzNlYxMDQuMkM4My4xNzkzIDEwNC43NTggODIuOTU3IDEwNS4yOTQgODIuNTYxMiAxMDUuNjg5TDQ0Ljc1OTYgMTQzLjQxNEM0My40MzEgMTQ0Ljc0IDQxLjE2MDUgMTQzLjggNDEuMTYwNSAxNDEuOTI1VjEyMi40ODlDNDEuMTYwNSAxMjEuOTMgNDEuMzgyNiAxMjEuMzk1IDQxLjc3ODEgMTIxTDYxLjgzMjUgMTAwLjk3NEM2Mi4yMjc4IDEwMC41NzkgNjIuNDUgMTAwLjA0MyA2Mi40NSA5OS40ODQ3VjgwLjM2MzJDNjIuNDUgNzkuODA0MiA2Mi42NzI2IDc5LjI2ODEgNjMuMDY4NiA3OC44NzMyTDEwMS40MyA0MC42MTc1WiIgZmlsbD0iIzM0NTZGNSIvPgo8L3N2Zz4K'

// Authorised signature (source: `public/signature.png`)
const AUTHORISED_SIGNATURE = '/signature.png'

function asUpper(value: string) {
  return (value || '').toUpperCase()
}

interface OfferLetterData {
  firstName: string
  middleName: string
  lastName: string
  phoneNumber: string
  emailId: string
  pf: string
  locationState: string // State for LWF/PT/ESIC calculations
  locationCity: string // City location (shown in PDF)
  doj: string
  nth: string // Net Salary
  ta: string
  designation: string
  offerId: string
  offerSend: string
  doo: string
  clientName?: string
  salaryBreakdown: SalaryBreakdown
  /**
   * Optional signature image source for react-pdf Image.
   * - Client default: `/signature.png` (served from Next `public/`)
   * - Server bulk/zip: pass a data URI like `data:image/png;base64,...`
   */
  authorisedSignatureSrc?: string
  /**
   * Optional logo image source for react-pdf Image.
   * - Client default: `/jobsmato-logo.png` (served from Next `public/`)
   * - Server bulk/zip: pass a data URI like `data:image/png;base64,...`
   */
  logoSrc?: string
}

// Stop mid-word hyphenation
Font.registerHyphenationCallback((word) => [word])

const styles = StyleSheet.create({
  page: {
    padding: 40,
    // Reserve space for fixed header/footer so body content never overlaps them
    // Slightly smaller so the page doesn't feel "short"
    paddingTop: 80,
    paddingBottom: 50,
    fontSize: 11,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: '#3456F5',
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logoContainer: {
    width: 130,
  },
  logo: {
    width: 110,
    height: 40,
  },
  addressContainer: {
    flex: 1,
    marginLeft: 12,
    alignItems: 'flex-end',
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'left',
  },
  address: {
    fontSize: 9,
    textAlign: 'right',
    marginBottom: 2,
    lineHeight: 1.3,
    color: '#3456F5',
  },
  title: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    fontWeight: 900,
    marginTop: 6,
    marginBottom: 6,
    textAlign: 'center',
  },
  dateSection: {
    marginTop: 4,
    marginBottom: 4,
    fontSize: 11,
  },
  greeting: {
    marginBottom: 4,
    fontSize: 11,
  },
  metaSection: {
    marginTop: 4,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 6,
  },
  metaLeft: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    fontWeight: 900,
    letterSpacing: 0,
  },
  metaRight: {
    width: 190,
    textAlign: 'right',
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    fontWeight: 900,
    letterSpacing: 0,
  },
  metaLabel: {
    fontFamily: 'Helvetica-Bold',
    fontWeight: 900,
  },
  metaValue: {
    fontFamily: 'Helvetica-Bold',
    fontWeight: 900,
  },
  userValue: {
    fontFamily: 'Helvetica-Bold',
    fontWeight: 900,
  },
  content: {
    marginBottom: 8,
    textAlign: 'justify',
    fontSize: 11,
    lineHeight: 1.6,
  },
  paragraph: {
    marginBottom: 8,
    textAlign: 'justify',
    fontSize: 11,
    lineHeight: 1.6,
  },
  section: {
    marginTop: 6,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  table: {
    marginTop: 3,
    marginBottom: 3,
    border: '1 solid #000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #000',
  },
  tableCell: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 5,
    fontSize: 10,
    borderRight: '1 solid #000',
    lineHeight: 1.25,
    textAlign: 'center',
  },
  tableCellLabel: {
    flex: 2.4,
    paddingVertical: 4,
    paddingHorizontal: 5,
    fontSize: 10,
    borderRight: '1 solid #000',
    fontWeight: 'normal',
    lineHeight: 1.25,
    textAlign: 'left',
  },
  tableCellLabelBold: {
    flex: 2.4,
    paddingVertical: 4,
    paddingHorizontal: 5,
    fontSize: 10,
    borderRight: '1 solid #000',
    fontWeight: 'bold',
    lineHeight: 1.25,
    textAlign: 'left',
  },
  tableCellBold: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 5,
    fontSize: 10,
    borderRight: '1 solid #000',
    fontWeight: 'bold',
    lineHeight: 1.25,
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottom: '1 solid #000',
  },
  tableHeaderCell: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 5,
    fontSize: 10,
    fontWeight: 'bold',
    borderRight: '1 solid #000',
    textAlign: 'center',
    lineHeight: 1.25,
  },
  tableHeaderCellFirst: {
    flex: 2.4,
    paddingVertical: 4,
    paddingHorizontal: 5,
    fontSize: 10,
    fontWeight: 'bold',
    borderRight: '1 solid #000',
    textAlign: 'left',
    lineHeight: 1.25,
  },
  noteBox: {
    marginTop: 6,
    marginBottom: 4,
    padding: 5,
    backgroundColor: '#fff9e6',
    border: '1 solid #ddd',
  },
  signature: {
    marginTop: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    // Keep both columns the same height so bottom labels align (SS2)
    minHeight: 140,
  },
  signatureBlock: {
    width: '48%',
    flexDirection: 'column',
  },
  signatureBlockLeft: {
    width: '48%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  signatureBlockRight: {
    width: '48%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  signatureBottomText: {
    fontSize: 10,
  },
  signatureLine: {
    marginBottom: 25,
    fontSize: 10,
    lineHeight: 1.4,
  },
  authorisedSignatureImage: {
    width: 110,
    height: 38,
    marginBottom: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 11,
    color: '#000',
  },
  footerLink: {
    color: '#3456F5',
    textDecoration: 'underline',
  },
  listItem: {
    marginBottom: 6,
    paddingLeft: 6,
    fontSize: 11,
    lineHeight: 1.55,
  },
  spacer: {
    height: 14,
  },
})

const OfferLetterDocument = ({ data }: { data: OfferLetterData }) => {
  const fullName = `${data.firstName} ${data.middleName ? data.middleName + ' ' : ''}${data.lastName}`.trim()
  
  // Format date as "09th-Jan-2026" (with ordinal for offer date)
  const formatDateWithOrdinal = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const day = date.getDate()
    const month = format(date, 'MMM')
    const year = date.getFullYear()
    const ordinal = day === 1 || day === 21 || day === 31 ? 'st' :
                    day === 2 || day === 22 ? 'nd' :
                    day === 3 || day === 23 ? 'rd' : 'th'
    return `${day}${ordinal}-${month}-${year}`
  }
  
  // Format date as "20-Jan-2026" (without ordinal for DOJ in section 1)
  const formatDateWithoutOrdinal = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const day = date.getDate()
    const month = format(date, 'MMM')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }
  
  const dojDate = formatDateWithoutOrdinal(data.doj)
  const offerDate = formatDateWithOrdinal(data.doo || new Date().toISOString().split('T')[0])
  const clientName = data.clientName || 'CREDHAS TECHNOLOGY PRIVATE LIMITED'

  // Requirement: name/company/dates should always be capital
  const fullNameUpper = asUpper(fullName)
  const clientNameUpper = asUpper(clientName)
  const offerIdUpper = asUpper(data.offerId || '')
  // Always use city name in the offer letter, never state name
  const locationCityUpper = asUpper(data.locationCity || '')
  const designationUpper = asUpper(data.designation || '')
  const dojDateUpper = asUpper(dojDate)
  const offerDateUpper = asUpper(offerDate)
  const fmtMoney = (n: number) => (Number.isFinite(n) ? String(Math.round(n)) : '0')

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={false}>
        <View style={styles.topBar} fixed />
        {/* Header */}
        <View style={styles.header} fixed>
          <View style={styles.logoContainer}>
            <Image src={data.logoSrc || '/jobsmato-logo.png'} style={styles.logo} />
          </View>
          <View style={styles.addressContainer}>
          <Text style={styles.address}>
            5th Floor,{'\n'}
            Tower A, Spaze iTech Park{'\n'}
            Sec 49, Sohna Road{'\n'}
            Gurugram, Haryana- 122018
          </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Offer of Employment</Text>

        {/* Date and Reference */}
        <View style={styles.metaSection}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLeft}>
              <Text style={styles.metaLabel}>Dear:</Text> <Text style={styles.metaValue}>{fullNameUpper}</Text>
            </Text>
            <Text style={styles.metaRight}>
              <Text style={styles.metaLabel}>Date:</Text> <Text style={styles.metaValue}>{offerDateUpper}</Text>
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLeft}>
              <Text style={styles.metaLabel}>Ref:</Text> <Text style={styles.metaValue}>{clientNameUpper}</Text>
            </Text>
            <Text style={styles.metaRight}>
              <Text style={styles.metaLabel}>Offer ID:</Text> <Text style={styles.metaValue}>{offerIdUpper}</Text>
            </Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text>
            We are pleased to appoint you as <Text style={styles.userValue}>{designationUpper}</Text> with our Client{' '}
            <Text style={styles.userValue}>{clientNameUpper}</Text> located at our client project site at <Text style={styles.userValue}>{locationCityUpper}</Text>, on a fixed Term Basis. 
            You are required to complete all joining formalities within 10 days from the date of joining.
          </Text>
          <Text style={{ marginTop: 4 }}>In addition to this:</Text>
        </View>

        {/* Section 1 */}
        <View style={styles.section}>
          <Text style={styles.listItem}>
            1.Your assignment with the Company will be effective from the date of the <Text style={styles.userValue}>{dojDateUpper}</Text>. Your engagement will be governed as per clauses mentioned in this letter and the attached Letter of Engagement.
          </Text>
        </View>

        {/* Section 2 - CTC Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Your CTC Details would be:</Text>
          
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCellFirst}>Components</Text>
              <Text style={styles.tableHeaderCell}>Monthly (INR)</Text>
              <Text style={styles.tableHeaderCell}>Annually (INR)</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Basic Salary</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.basic)}</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.basic * 12)}</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>House Rent Allowance</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.hra)}</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.hra * 12)}</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Bonus Amount</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.bonusAmount)}</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.bonusAmount * 12)}</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabelBold}>Gross Total Earnings (A)</Text>
              <Text style={styles.tableCellBold}>{fmtMoney(data.salaryBreakdown.grossTotalEarnings)}</Text>
              <Text style={styles.tableCellBold}>{fmtMoney(data.salaryBreakdown.grossTotalEarnings * 12)}</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Employee PF</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.pfEmployee)}</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.pfEmployee * 12)}</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Employee ESI</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.esiEmployee)}</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.esiEmployee * 12)}</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Professional Tax</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.professionalTax)}</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.professionalTax * 12)}</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Employee LWF</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.employeeLWF)}</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.employeeLWF * 12)}</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Medicclaim Deduction</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.medicclaimDeduction)}</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.medicclaimDeduction * 12)}</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabelBold}>Total Deductions (B)</Text>
              <Text style={styles.tableCellBold}>{fmtMoney(data.salaryBreakdown.totalDeductions)}</Text>
              <Text style={styles.tableCellBold}>{fmtMoney(data.salaryBreakdown.totalDeductions * 12)}</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabelBold}>Net Salary (A-B)</Text>
              <Text style={styles.tableCellBold}>{fmtMoney(data.salaryBreakdown.netSalary)}</Text>
              <Text style={styles.tableCellBold}>{fmtMoney(data.salaryBreakdown.netSalary * 12)}</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Variable Incentive</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.variableIncentive)}</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.variableIncentive * 12)}</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Employer PF</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.pfEmployer)}</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.pfEmployer * 12)}</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>PF Admin Charge</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.pfAdminCharge)}</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.pfAdminCharge * 12)}</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>PF EDLI Charge</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.pfEDLICharge)}</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.pfEDLICharge * 12)}</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Employer ESI</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.esiEmployer)}</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.esiEmployer * 12)}</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Employer LWF</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.employerLWF)}</Text>
              <Text style={styles.tableCell}>{fmtMoney(data.salaryBreakdown.employerLWF * 12)}</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabelBold}>Total Benefits (C)</Text>
              <Text style={styles.tableCellBold}>{fmtMoney(data.salaryBreakdown.totalBenefits)}</Text>
              <Text style={styles.tableCellBold}>{fmtMoney(data.salaryBreakdown.totalBenefits * 12)}</Text>
            </View>
            
            <View style={[styles.tableRow, { borderTop: '1 solid #000' }]}>
              <Text style={styles.tableCellLabelBold}>Total Cost to Company (A+C)</Text>
              <Text style={styles.tableCellBold}>{fmtMoney(data.salaryBreakdown.ctc / 12)}</Text>
              <Text style={styles.tableCellBold}>{fmtMoney(data.salaryBreakdown.ctc)}</Text>
            </View>

            {/* Repeat header at bottom (as in reference SS2) */}
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCellFirst}>Components</Text>
              <Text style={styles.tableHeaderCell}>Monthly (INR)</Text>
              <Text style={styles.tableHeaderCell}>Annually (INR)</Text>
            </View>
          </View>
        </View>

        {/* Note about Travel Allowance - Only show if TA is provided */}
        {data.salaryBreakdown.travelAllowance !== undefined && 
         data.salaryBreakdown.travelAllowance !== null && 
         typeof data.salaryBreakdown.travelAllowance === 'number' &&
         data.salaryBreakdown.travelAllowance > 0 && (
          <View style={styles.noteBox}>
            <Text style={{ fontWeight: 'bold', fontSize: 11 }}>Note: {data.salaryBreakdown.travelAllowance.toLocaleString('en-IN')} Rs is Travel Allowance</Text>
          </View>
        )}

        {/* Section 3 */}
        <View style={styles.section}>
          <Text style={styles.content}>
            Your salary is payable only through electronic payment mode such as EFT/NEFT/RTGS/ECS or account payable cheque for which you have to provide relevant information at the time of Joining. A one-month grace period shall be provided to you on reasonable ground.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerLink}>https://jobsmato.com</Text>
          <Text>+91-8595118080</Text>
          <Text>hr@jobsmato.com</Text>
        </View>
      </Page>

      {/* Second Page - Sections 3-7 */}
      <Page size="A4" style={styles.page} wrap={false}>
        <View style={styles.topBar} fixed />
        <View style={styles.header} fixed>
          <View style={styles.logoContainer}>
            <Image src={data.logoSrc || '/jobsmato-logo.png'} style={styles.logo} />
          </View>
          <View style={styles.addressContainer}>
            <Text style={styles.address}>
              5th Floor,{'\n'}
              Tower A, Spaze iTech Park{'\n'}
              Sec 49, Sohna Road{'\n'}
              Gurugram, Haryana- 122018
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.listItem}>
            3. In addition to the Monthly Salary, you will not be entitled to any other perquisites/ allowances unless given to you in writing. Your coverage under ESIC scheme, Provident Fund scheme, and Bonus Act where applicable will be as per the government regulations. Salary would be receivable on or before 10th of the subsequent month, subject to receipt of corresponding payments from our Client where you will be deployed. Any discrepancy in the salary received needs to be reported to our nearest branch within 7 days of receipt of salary after which, it will be considered as correct and further claims will not be entertained. Gratuity will be payable as per Payment of gratuity Act, 1972. TDS will be deducted at Higher rate as per Income Tax Act, in case PAN number along with proof is not provided to nearest JobsMato Branch within 7 days of joining. Any unclaimed salary within 3 years from when it is due, will be paid to the Labour Welfare Fund as per Labour Welfare Fund Act. You will be entitled to leave as per the practice followed by the client.
          </Text>

          <Text style={styles.listItem}>
            4. If your coverage under ESIC scheme is subject to adherence to rules & regulation of it. It is mandatory for you to submit Aadhar Card (UID) including your family within one month from the date of issuance of ESIC number, if you fail to submit the Aadhar Card (UID) within stipulated period in that case you will not be eligible to take benefits of ESIC coverage and in that Circumstances Company shall not be held responsible. Quantumhues Tech Private Limited shall comply with all statutory obligations under the Employees' State Insurance Act, 1948 and Employees' Provident Funds & Miscellaneous Provisions Act, 1952, as applicable.
          </Text>

          <Text style={styles.listItem}>
            5. If you are eligible under the Provident Fund scheme subject to adherence of rules & regulation of it. It is also mandatory for you to submit an Aadhar Card (UID), PAN Card & Bank A/c. No. with IFSC Code (collectively referred as 'KYC') within one month from your date of joining, if you fail to submit the KYC within stipulated period in that case as per PF norms you will not able to withdraw or transfer or to take any benefits of PF and in that circumstances company shall not be held responsible or liable.
          </Text>

          <Text style={styles.listItem}>
            6. Since our Client undertakes contract projects, you may be required to work at different project sites and are likely to be deputed in any establishment within the city or outside the city including outside the State for the purpose of discharging your duties as and when the situation demands, at the said working hours.
          </Text>

          <Text style={styles.listItem}>
            7. You will act within the framework of organizational structure and policies and directions as may be laid down by the management from time to time. During the tenure of your{'\n'}employment with us, you will not undertake any other employment or business activities, work or public office of payment or otherwise except with the written permission of the Management. If you are found involved in any act which in the opinion of the Company is detrimental to the interest of their business interest, Management shall be at liberty to{'\n'}{'\n'}dispense with your services immediately and without any notice or compensation. At all times during the tenure of this Contract of employment you will be bound by any Rules & Regulations enforced by the management from time to time in relation to the conduct, discipline, leave, holidays or any other matters relating to service conditions.
          </Text>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerLink}>https://jobsmato.com</Text>
          <Text>+91-8595118080</Text>
          <Text>hr@jobsmato.com</Text>
        </View>
      </Page>

      {/* Fourth Page - Sections 8-9 and Signature */}
      <Page size="A4" style={styles.page} wrap={false}>
        <View style={styles.topBar} fixed />
        <View style={styles.header} fixed>
          <View style={styles.logoContainer}>
            <Image src={data.logoSrc || '/jobsmato-logo.png'} style={styles.logo} />
          </View>
          <View style={styles.addressContainer}>
            <Text style={styles.address}>
              5th Floor,{'\n'}
              Tower A, Spaze iTech Park{'\n'}
              Sec 49, Sohna Road{'\n'}
              Gurugram, Haryana- 122018
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.listItem}>
            8. Either party can terminate the employment during the existence of an Appointment Letter, as per the terms laid out in the Letter of Engagement. You shall at no point of time stake any claim or right to claim employment, damage, loss or compensation of any sort whatsoever against our clients. Your continuance in employment is subject to your remaining physically{'\n'}and mentally fit. As and when required, the Management may require you to submit yourself to medical examination by a physician of the choice of the management.
          </Text>

          <Text style={styles.listItem}>
            9. This letter is being sent to you in duplicate, please return two copies of the same, duly signed as the token of acceptance of this Contract of employment with the above terms and conditions.
          </Text>
        </View>

        <View style={styles.spacer} />

        {/* Signature */}
        <View style={styles.signature} wrap={false}>
          <View style={styles.signatureBlockLeft}>
            <View>
              <Text style={styles.signatureLine}>Warm Regards</Text>
              <Text style={styles.signatureLine}>For Quantumhues Tech Private Limited</Text>
              <Image
                src={data.authorisedSignatureSrc || AUTHORISED_SIGNATURE}
                style={styles.authorisedSignatureImage}
              />
            </View>
            <Text style={styles.signatureBottomText}>Authorised Signatury</Text>
          </View>
          <View style={styles.signatureBlockRight}>
            <View>
              <Text style={[styles.signatureLine, { marginBottom: 8 }]}>
                I have received the Work Assignment Letter and agree to the terms and conditions.
              </Text>
            </View>
            <View>
              <Text style={[styles.signatureLine, { marginBottom: 6 }]}>_______________________</Text>
              <Text style={styles.signatureBottomText}>{fullNameUpper}</Text>
            </View>
          </View>
        </View>
        <View style={styles.spacer} />
        <View style={styles.spacer} />        
        <View style={styles.spacer} />        
        <View style={styles.spacer} />        
        <View style={styles.spacer} />         
        <View style={styles.spacer} />         
        <View style={styles.spacer} />         
        <View style={styles.spacer} />         
        <View style={styles.spacer} />         
        <View style={styles.spacer} />         
        <View style={styles.spacer} />         
        <View style={styles.spacer} />         
        <View style={styles.spacer} />         
        <View style={styles.spacer} />         
        <View style={styles.spacer} />         
        <View style={styles.spacer} />         
        <View style={styles.spacer} />         
        <View style={styles.spacer} />         
        <View style={styles.spacer} />         
        <View style={styles.spacer} />         
        <View style={styles.spacer} />         
        <View style={styles.spacer} />         
        <View style={styles.spacer} />         
        <View style={styles.spacer} />

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerLink}>https://jobsmato.com</Text>
          <Text>+91-8595118080</Text>
          <Text>hr@jobsmato.com</Text>
        </View>
      </Page>

      {/* Fifth Page - Letter of Engagement */}
      <Page size="A4" style={styles.page}>
        <View style={styles.topBar} fixed />
        <View style={styles.header} fixed>
          <View style={styles.logoContainer}>
            <Image src={data.logoSrc || '/jobsmato-logo.png'} style={styles.logo} />
          </View>
          <View style={styles.addressContainer}>
            <Text style={styles.address}>
              5th Floor,{'\n'}
              Tower A, Spaze iTech Park{'\n'}
              Sec 49, Sohna Road{'\n'}
              Gurugram, Haryana- 122018
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Letter of Engagement with our Clients/Business Partners</Text>

          <View style={styles.metaSection}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLeft}>
                <Text style={styles.metaLabel}>Dear:</Text> <Text style={styles.metaValue}>{fullNameUpper}</Text>
              </Text>
              <Text style={styles.metaRight}>
                <Text style={styles.metaLabel}>Date:</Text> <Text style={styles.metaValue}>{dojDateUpper}</Text>
              </Text>
            </View>
          </View>

          <Text style={styles.paragraph}>
            1. QUANTUMHUES TECH PRIVATE LIMITED (operating under the brand name "JobsMato") is involved in the business of providing services to manage key business processes of our Clients/ Business Partners. Based on your interaction with us, we wish to confirm your registration with us for the purpose of selection to perform any service ("Work Assignment":) that may be required by our Clients/ Business Partners ("Customer").
          </Text>

          <Text style={styles.paragraph}>
            2. It is understood that mere registration with QUANTUMHUES TECH PRIVATE LIMITED does not guarantee you any Work Assignment and is subject to selection by QUANTUMHUES TECH PRIVATE LIMITED and/or its Customers. QUANTUMHUES TECH PRIVATE LIMITED may offer to engage you to perform specific Work Assignments from time to time for any of its Customers at a specified location and you may choose to accept such offer at your discretion.
          </Text>

          <Text style={styles.paragraph}>
            3. The terms of this letter ("Engagement Letter") shall govern your relationship with QUANTUMHUES TECH PRIVATE LIMITED now and in the future. Each Work Assignment will be governed by the terms of this letter and the specific Work Assignment Letter. In the event of any inconsistency, the terms of the relevant Work Assignment Letter shall govern.
          </Text>

          {/* NOTE: Clause 4 is intentionally split into multiple Text blocks so it can paginate naturally (avoids large blank gaps). */}
          <Text style={styles.paragraph}>
            4. Execution of any Work Assignment Letter by you shall be a full and complete acceptance by you to perform the services. Upon acceptance, you shall;
          </Text>
          <Text style={styles.paragraph}>
            I. fully perform the services, in a professional manner, at the Customer's location till the completion of the term of the Work Assignment;
          </Text>
          <Text style={styles.paragraph}>
            II. during the term of the Work Assignment, render services exclusively to the Customer and such performance shall not be inconsistent with any obligation you may have to other third parties;
          </Text>
          <Text style={styles.paragraph}>
            III. not engage in any conduct detrimental to the interests of the Customer or QUANTUMHUES TECH PRIVATE LIMITED;
          </Text>
          <Text style={styles.paragraph}>
            IV. not receive any payments of any nature directly from the Customer unless agreed to by QUANTUMHUES TECH PRIVATE LIMITED;
          </Text>
          <Text style={styles.paragraph}>
            V. not, either directly or indirectly, offer yourself for employment with the Customer, its agencies or its affiliates during the period of the Work Assignment without the prior permission of QUANTUMHUES TECH PRIVATE LIMITED;
          </Text>
          <Text style={styles.paragraph}>
            VI. comply with the safety, health, environment and other rules and regulations of the Customer provided that you have been made aware of the same;
          </Text>
          <Text style={styles.paragraph}>
            VII. report and be present at the Customer's designated location during the working hours mentioned in the applicable Work Assignment Letter;
          </Text>
          <Text style={styles.paragraph}>
            VIII. extend all co-operation to the Customer's employees, consultants, representatives, etc., and do all such things as may be necessary and comply with all terms of the applicable Work Assignment Letter so as to effectively undertake the Work Assignment.
          </Text>

          <Text style={styles.paragraph}>
            5. At the end of each Record Period, as mentioned in the Work Assignment Letter, or at the completion of the Work Assignment, whichever is applicable, you will deliver to the Customer, a Time Sheet (or any other format/register as required by the Customer) containing the number of hours worked in any given day at the Customer's location and such other details as may be prescribed by QUANTUMHUES TECH PRIVATE LIMITED and produce the same to QUANTUMHUES TECH PRIVATE LIMITED upon request.
          </Text>

          <Text style={styles.paragraph}>
            6. As consideration for the services performed during any Work Assignment, QUANTUMHUES TECH PRIVATE LIMITED will pay you remuneration, as per the Work Assignment Letter. QUANTUMHUES TECH PRIVATE LIMITED will be entitled to make deductions as per applicable law or in respect of any amounts due to QUANTUMHUES TECH PRIVATE LIMITED or the Customer from you. You will be reimbursed any approved expenses subject to your submitting original bills/declarations as required by QUANTUMHUES TECH PRIVATE LIMITED and/or the Customer.
          </Text>

          <Text style={styles.paragraph}>
            7. Any intellectual property that results from work performed by the Individual under any Work Assignment Letter shall be the property of the Customer and the Individual agrees to assign/transfer to the Customer, the worldwide, perpetual and entire right, title, and interest in all intellectual properties including all rights to obtain, register, perfect, and enforce patents, copyrights, and other intellectual property protection under any laws and conventions.
          </Text>

          <Text style={styles.paragraph}>
            8. All proprietary information/material of the Customer that is made known to you during the term of the Work Assignment shall be received in confidence and you shall not disclose or, except in performing the services, use any such proprietary information/material. You agree that all information, correspondence, documents, materials or items provided to you by the Customer or QUANTUMHUES TECH PRIVATE LIMITED are provided to you in trust and on lapse/termination of the Work Assignment, you shall promptly return all such material to the Customer or QUANTUMHUES TECH PRIVATE LIMITED, as the case may be.
          </Text>

          <Text style={styles.paragraph}>
            9. You agree that this Letter of Engagement creates no obligation on the part of either party unless you are selected for a particular Work Assignment and you execute the relevant Work Assignment. By executing this Letter of Engagement, neither do we offer you employment with QUANTUMHUES TECH PRIVATE LIMITED nor do you become an employee of QUANTUMHUES TECH PRIVATE LIMITED. The terms of this Letter of Engagement shall however govern any Work Assignments that you undertake to perform.
          </Text>

          <Text style={styles.paragraph}>
            10. Should you be selected to perform the Work Assignment, the nature of your relationship with QUANTUMHUES TECH PRIVATE LIMITED will be that of Employment/Contract of Service for a period mentioned in the Work Assignment Letter. Upon lapse or termination of the Work Assignment, your employment with QUANTUMHUES TECH PRIVATE LIMITED shall stand terminated forthwith.
          </Text>

          <Text style={styles.paragraph}>
            11. Except for lapse of a Work Assignment due to completion, if either Party wishes to terminate the Work Assignment during its existence, the terminating Party shall provide a notice of 30 days to the other Party for Work Assignments of duration 6 months or more. However, in case of Work Assignments of duration under six months duration, a notice period of Fourteen Days is required. In case you fail to give the above notice, the salary in lieu of notice will be recovered from you.
          </Text>

          <Text style={styles.paragraph}>
            12. In case there is no Work Assignment subsisting, either party may terminate this Letter of Engagement forthwith by sending notice in writing. If a Work Assignment is subsisting, this Letter of Engagement can be terminated only co-terminus with the relevant Work Assignment as per the notice period required for termination of the Work Assignment as above.
          </Text>

          <Text style={styles.paragraph}>
            13. Termination of this Letter of Engagement shall not affect the obligations of the parties that have been incurred prior to termination and QUANTUMHUES TECH PRIVATE LIMITED will promptly settle all your dues after making applicable deductions. Further, obligations relating to confidentiality and intellectual property shall continue after termination/expiry of this Letter of Engagement or the Work Assignment.
          </Text>

          <Text style={styles.paragraph}>
            14. You agree to defend, indemnify and hold QUANTUMHUES TECH PRIVATE LIMITED or the Customer harmless from any and all claims, damages, liability, attorneys' fees and expenses on account of your failure to satisfy any of your obligations under this Letter of Engagement or under the Work Assignment Letter or for misconduct, violation of any law or creation of any legal liability by you.
          </Text>

          <Text style={styles.paragraph}>
            15. Any dispute between the Individual and QUANTUMHUES TECH PRIVATE LIMITED shall be referred to a sole arbitrator to be selected from a list of arbitrators nominated by QUANTUMHUES TECH PRIVATE LIMITED. The arbitration shall be conducted in English language, in accordance with the Arbitration and Conciliation Act, 1996, at Mumbai, India. This engagement letter shall be governed in all respects by the laws of India.
          </Text>

          <Text style={styles.paragraph}>
            16. In addition to the terms contained herein, your relationship with QUANTUMHUES TECH PRIVATE LIMITED may be subject to such other additional terms and conditions as may be communicated to you from time to time in writing by QUANTUMHUES TECH PRIVATE LIMITED.
          </Text>

          <Text style={styles.paragraph}>
            We request you to please sign a duplicate copy of this letter and return the same to us, indicating your acceptance of the terms mentioned herein. By signing this letter, you confirm that you have read, fully understood and accepted the terms of this letter.
          </Text>
        </View>

        {/* Signature */}
        <View style={styles.signature} wrap={false}>
          <View style={styles.signatureBlockLeft}>
            <View>
            <Text style={styles.signatureLine}>Warm Regards</Text>
            <Text style={styles.signatureLine}>For Quantumhues Tech Private Limited</Text>
              <Image
                src={data.authorisedSignatureSrc || AUTHORISED_SIGNATURE}
                style={styles.authorisedSignatureImage}
              />
            </View>
            <Text style={styles.signatureBottomText}>Authorised Signatury</Text>
          </View>
          <View style={styles.signatureBlockRight}>
            <View>
              <Text style={[styles.signatureLine, { marginBottom: 8 }]}>
                I have received the Work Assignment Letter and agree to the terms and conditions.
              </Text>
            </View>
            <View>
              <Text style={[styles.signatureLine, { marginBottom: 6 }]}>_______________________</Text>
              <Text style={styles.signatureBottomText}>{fullNameUpper}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerLink}>https://jobsmato.com</Text>
          <Text>+91-8595118080</Text>
          <Text>hr@jobsmato.com</Text>
        </View>
      </Page>
    </Document>
  )
}

export async function generateOfferLetterPDF(data: OfferLetterData) {
  try {
    const doc = <OfferLetterDocument data={data} />
    const asPdf = pdf(doc)
    const blob = await asPdf.toBlob()
    
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Offer_Letter_${data.firstName}_${data.lastName}_${data.offerId || 'OFFER'}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
}

/**
 * Server-friendly PDF rendering: returns a Node Buffer.
 * Used for bulk ZIP generation in API routes.
 */
export async function renderOfferLetterPDFBuffer(data: OfferLetterData): Promise<Buffer> {
  const doc = <OfferLetterDocument data={data} />
  const asPdf: any = pdf(doc)

  if (typeof asPdf.toBuffer === 'function') {
    return await asPdf.toBuffer()
  }

  throw new Error('PDF renderer does not support toBuffer() in this environment.')
}
