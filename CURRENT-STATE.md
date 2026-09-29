# CURRENT STATE

Дата: 2026-09-29

## Текущая версия

Интерактивная документация v0.5.

## Реализовано

- единая одностраничная карта KnockUI;
- разделы формируются из `data/sections.json`;
- точное место ячейки задаётся полями `section` и `order` в `data/cells.json`;
- охвачены Android, iOS, WeChat и WhatsApp;
- отражены B2C и B2B;
- добавлены региональная стратегия, roadmap и методология;
- каждая ячейка имеет интерактивное пояснение;
- подробная карточка показывает параметры, входы, выходы, ограничения и открытые вопросы;
- поиск по документации;
- фильтры по платформе и модели;
- фильтр по статусу;
- отдельный фильтр по результату технической проверки;
- типизированные видимые связи между ячейками (`flow / branch / model / constraint / strategy / roadmap / governance`);
- фильтр отображения связей;
- подписи активных связей;
- runtime-проверка ссылочной целостности графа;
- прямые URL на ячейки;
- матрица 1260 двухсимвольных комбинаций.

## Редактирование

Схема содержательных файлов описана в `data/README.md`. Для добавления разделов, ячеек и связей менять HTML не требуется.

## Аудит полноты

Структурный аудит выполнен. Результаты и исправления зафиксированы в `AUDIT-2026-09-28.md`.

Состояние на момент аудита 2026-09-28:
- 50 ячеек;
- 79 связей;

Текущее состояние карты:
- 72 ячейки;
- 149 связей;
- roadmap развёрнут в шесть этапов: Android end-to-end → Product Canon → User Configuration → Integration Catalog → Launch/Monetization+B2B → Cross-platform;
- Android-поток дополнен разрешениями, валидацией зоны, fail-safe, обратной связью первого символа, хранилищем, редактором назначений, compliance и energy budget;
- iOS и WeChat имеют явные action-узлы;
- общие продуктовые принципы связаны с платформенными адаптациями;
- браузер проверяет несуществующие ссылки, дубликаты, неизвестные section/status/type и изолированные ячейки.

## Техническая верификация

Выполнена первая платформенная техническая проверка. Полный результат: `TECH-VERIFICATION-2026-09-28.md`.

Ключевые результаты:
- подтверждён главный Android-блокер: публичные AccessibilityService touch-механизмы не дают требуемый пассивный глобальный Quad Tap без изменения/перехвата доставки касаний;
- `TYPE_APPLICATION_OVERLAY` и permission flow подтверждены как рабочая технология для локального overlay после активации;
- универсальное определение «пустой/неактивной» точки в чужом приложении не может считаться гарантированным;
- Android intents/deep links подтверждены с ограничениями background activity launch и resolver;
- требования Google Play к AccessibilityService и package visibility внесены в документацию;
- $1 Recognizer оставлен как технически реальный MVP-кандидат, но качество на 36 символах требует собственного прототипа;
- iOS Custom Keyboard подтверждён как ограниченная input surface; App Review Guideline 4.4.1 блокирует запуск произвольных приложений из keyboard extension;
- WeChat Mini Program подтверждён как локальная/contained среда, не глобальный OS-layer;
- WhatsApp Cloud API подтверждает чатовый command/response transport через webhooks;
- рыночные тезисы вынесены из технической проверки.

На карте появился отдельный узел `android-global-trigger-limitation`, а вводящая в заблуждение прямая flow-связь `android-integration → android-quad-tap` удалена.

## Следующий этап

1. Android downstream chain и внешний activation adapter считать подтверждёнными.
2. In-app 4-tap и debug broadcast сохранять только как test harness.
3. На штатном Android-устройстве проверить канонический system-owned нижний LEFT/RIGHT угол: 3/4 последовательных тапа, доступность событий системному detector и перехват последовательности foreground-приложениями; затем связать подтверждённый путь с `ActivationRequest`.
4. OEM/SystemUI reserved Quad Tap zone сохранить как отдельную отложенную исследовательскую ветвь, а не как текущий следующий шаг.
5. Отдельно продолжать iOS action model и другие платформенные адаптации.


## Полнота технических выводов

Все выводы технической проверки разнесены по интерактивным ячейкам, а не оставлены только в TECH-VERIFICATION-2026-09-28.md.

Дополнительно введены архитектурные узлы:
- `platform-adaptation-model` — общий протокол при разных platform entry/action models;
- `android-activation-redesign` — обязательное решение по замене пассивного глобального trigger;
- `ios-action-redesign` — обязательное решение по iOS execution model.

В `verification` соответствующих ячеек теперь фиксируются не только summary/sources/next_step, но и `implication` — архитектурное следствие. Для WeChat также фиксируется `source_note` о необходимости финальной перепроверки по актуальной официальной документации/DevTools.


## Android activation strategy — stock OS first

Текущий порядок изменён:
- сначала проверяются механизмы, которые штатный Android/OEM предоставляет без root, bootloader unlock, custom ROM и изменения SystemUI;
- выбранный штатный trigger должен формировать уже подтверждённый `ActivationRequest`;
- Quad Tap остаётся целевым фирменным жестом, но конкретный системный способ его получения пока не считается решённым;
- OEM/SystemUI reserved zone сохраняется как возможная будущая интеграция, а не как текущий обязательный путь.

Для этой проверки подготовлено отдельное физическое устройство `LGM-V300L / Android 9`. Подробности восстановления и техническое состояние ведутся в рабочем репозитории `4tap-app`, без дублирования в публичной карте.

## Android post-activation drawing

Зафиксировано отдельное техническое положение:
- сложность глобального вызова KnockUI не переносится автоматически на последующее рисование;
- после активации можно использовать небольшой временный touchable `TYPE_APPLICATION_OVERLAY`;
- overlay принимает штрихи KnockUI внутри своей области;
- нижележащее приложение в пределах canvas во время ввода не получает эти касания;
- pass-through для gesture canvas не требуется;
- ограничения Android 12 на untrusted pass-through поэтому не блокируют эту схему.

Добавлена ячейка `android-drawing-overlay`. Основной input flow теперь проходит через неё: `Local Canvas → Drawing Overlay Surface → Gesture 1`.


## Android overlay over WeChat / WhatsApp

Зафиксирована двухконтурная модель:
- на Android системный/OEM-вызов KnockUI может открыть временный Drawing Overlay Surface поверх текущего foreground app, в том числе поверх WeChat и WhatsApp;
- одновременно сохраняются собственные внутренние KnockUI-пути: WeChat Mini Program и WhatsApp Business/chat transport;
- эти пути независимы и не заменяют друг друга;
- данное решение относится к Android; iOS рассматривается отдельно.

Добавлена ячейка `android-overlay-over-host-apps`.



## Android prototype baseline

Получен первый подтверждённый результат рабочей реализации `4tap-app`:
- минимальный Android-проект создан и успешно собирается;
- debug APK установлен на физическое Android-устройство;
- приложение успешно запущено;
- контрольный экран `4Tap / KnockUI — RUNNING` подтверждён на устройстве.

Этот результат подтверждает только рабочий Android application baseline. Активация KnockUI, Quad Tap, Drawing Overlay Surface и распознавание жестов ещё не реализованы.

Следующий практический шаг: touch-диагностика и минимальная поверхность ввода, затем распознавание эталонных одноштриховых `S` и `C`.


## Android touch prototype

В рабочем репозитории `4tap-app` подтверждён следующий практический рубеж:
- минимальная touch-поверхность работает на физическом Android-устройстве;
- отображается реальная траектория пальца;
- фиксируются touch events, координаты и тайминги;
- результат подтверждён как `TOUCH OK`.

Следующий prototype subset — только оригинальные Palm Graffiti `S` и `C`. Минимальный направленно-чувствительный распознаватель для этих двух знаков уже реализован в коде и ожидает проверки на физическом устройстве.


## Android SC prototype

В рабочем `4tap-app` подтверждён первый жестовый результат на физическом Android-устройстве:
- touch-поверхность работает;
- оригинальный Palm Graffiti `S` распознаётся;
- оригинальный Palm Graffiti `C` распознаётся;
- последовательность `S → C` корректно формирует команду `SC`.

Это ограниченная верификация только двух эталонов и одной тестовой команды. Она не подтверждает качество полного алфавита A–Z / 0–9.

Следующий практический шаг — перенести уже работающий ввод в post-activation KnockUI flow с временной локальной поверхностью, сохранив диагностику.


## Android in-app end-to-end prototype

На физическом Android-устройстве подтверждена ограниченная сквозная цепочка внутри launcher Activity:
- левый нижний угол → четыре тапа → локальный canvas → Palm Graffiti `S` → `C` → команда `SC`;
- правый нижний угол → четыре тапа → локальный canvas → Palm Graffiti `S` → `C` → команда `SC`;
- после завершения canvas закрывается и последняя команда сохраняется на экране ожидания.

Результат зафиксирован как `LEFT SC OK`, `RIGHT SC OK`.

Граница подтверждения принципиальна: угловые зоны и canvas пока находятся внутри самого 4Tap-приложения. Это проверяет UX/тайминги/распознавание и внутреннюю композицию цепочки, но не доказывает глобальный Android/OEM Quad Tap и не является проверкой `TYPE_APPLICATION_OVERLAY` поверх чужого приложения.

Следующий Android-эксперимент — настоящий временный touchable overlay с тем же подтверждённым `S → C → SC`.


## Android overlay real-device verification

Подтверждён post-activation drawing на физическом Android-устройстве:
- настоящий touchable `TYPE_APPLICATION_OVERLAY` создаётся после тестовой in-app активации;
- overlay остаётся поверх другого foreground-приложения;
- Palm Graffiti `S → C` распознаётся внутри overlay;
- команда `SC` формируется корректно;
- overlay автоматически закрывается после команды;
- сценарий подтверждён для левой и правой стороны: `LEFT OVERLAY SC OK`, `RIGHT OVERLAY SC OK`.

Это существенно сужает Android-риск: post-activation input surface и двухсимвольное распознавание подтверждены. Неподтверждённым остаётся системный/OEM activation trigger, который должен вызывать уже рабочий overlay без предварительного открытия 4Tap Activity.


## Android activation contract verified

После архитектурного разделения повторно подтверждён полный downstream-контур на физическом Android-устройстве:
- `ActivationRequest`;
- `OverlayLauncher`;
- настоящий `TYPE_APPLICATION_OVERLAY`;
- Palm Graffiti recognizer;
- двухсимвольная команда `SC`.

Контрольный результат: `REFACTOR LEFT SC OK`, `RIGHT SC OK`.

Это подтверждает, что источник активации можно менять независимо от overlay/recognizer/command. Текущий in-app 4-tap остаётся test harness. Неподтверждённым остаётся только системный/OEM trigger, который должен подать тот же `ActivationRequest`.


## Android external activation adapter verified

Подтверждён внешний activation adapter на физическом Android-устройстве без предварительного открытия 4Tap Activity:
- внешний explicit broadcast используется как тестовый аналог SystemUI;
- receiver формирует `ActivationRequest(source = OEM_SYSTEMUI_TEST)`;
- уже проверенный `OverlayLauncher` открывает настоящий Drawing Overlay поверх другого foreground-приложения;
- `S → C → SC` завершается корректно;
- подтверждены обе стороны: `OEM LEFT SC OK`, `OEM RIGHT SC OK`.

Тем самым практически подтверждена граница «внешняя система → 4Tap». Конкретный штатный источник активации ещё не выбран; текущий этап проверяет доступные механизмы Android/OEM без модификации ОС.


## Android command action verified

На штатном `LGM-V300L / Android 9` подтверждён следующий рубеж:
- внешний debug trigger формирует `ActivationRequest`;
- настоящий `TYPE_APPLICATION_OVERLAY` открывается поверх другой программы;
- `S → C` формирует `SC`;
- после завершения команды overlay закрывается;
- `SC` запускает назначенное тестовое действие `Settings.ACTION_SETTINGS`.

Таким образом, downstream теперь подтверждён до реального Android action execution:

`ActivationRequest → OverlayLauncher → Drawing Overlay → Recognizer → Command → Action`.

Единственный незакрытый риск Stage 1 — штатный Android/LG источник активации без ADB/debug broadcast и без модификации ОС.

## LG V30 raw touch baseline

Для основной опытной площадки определён touchscreen input-device:

- node: `/dev/input/event1`;
- name: `touch_dev`;
- property: `INPUT_PROP_DIRECT`;
- raw X: `0..1439`;
- raw Y: `0..2879`.

Raw coordinate space совпадает с physical display `1440 × 2880` один-к-одному. Поэтому дальнейшие system-corner tests можно фиксировать непосредственно в физических координатах экрана.

## LG V30 test geometry baseline

Для основной физической Android-площадки `LGM-V300L / Android 9 / V300L30p` зафиксирована текущая геометрия:

- display: `1440 × 2880 px`;
- physical density: `640 dpi`;
- override density: `560 dpi`;
- `NavigationBar`: `[0,2733][1440,2880]`;
- высота нижней системной панели: `147 px`.

Эти значения используются как reference при экспериментах с системным LEFT/RIGHT corner space и требуют повторного измерения при изменении density, navigation mode или firmware.

## Android system corner activation — restored canon

В публичной карте восстановлена каноническая модель углового вызова 4Tap:

- два системных пространства: нижний LEFT и RIGHT;
- пространство принадлежит system/OEM input layer и может быть визуально полностью закрыто foreground-приложением;
- активация выполняется последовательностью из **3 или 4 тапов**; точный активный порог является параметром продукта;
- отдельные pre-activation taps могут доходить foreground-приложению;
- если приложение или системный компонент перехватывает события так, что system detector не получает последовательность, activation может не состояться; это проверяется экспериментально;
- после достижения порога формируется уже подтверждённый `ActivationRequest`;
- `TYPE_APPLICATION_OVERLAY` используется только после активации как Drawing Overlay.

Поздняя схема «SystemUI полностью владеет зоной, fixed 4 taps, no passthrough/replay» сохранена только как **Strict OEM Reserved Zone — Prototype Variant** и больше не считается каноническим поведением 4Tap.

## Android SystemUI Quad Tap zone — deferred concept

Минимальная спецификация reserved zone сохранена:
- две system-owned зоны в нижних углах;
- baseline: `58 × 44 dp`;
- UX comparison: `52×40`, `58×44`, `64×48`;
- 4 taps с ранее проверенными таймингами;
- downstream после `ActivationRequest` остаётся неизменным.

AOSP/Cuttlefish заготовки также сохранены, но этот путь отложен. Текущий этап не предусматривает модификацию SystemUI или системных разделов реального устройства без отдельного решения.

## Product / UX plan update

В ближайший Android-контур добавлены обязательные продуктовые задачи:

- `4Tap Design Canon`: v0.1 до существенной переработки KnockUI overlay, v0.2 после первой полной real-device цепочки, v1.0 перед публичной beta;
- `4Tap Graffiti Profile`: Palm Graffiti остаётся baseline, но 4Tap утверждает собственные канонические формы; неудобные знаки могут меняться, символ `X` уже вынесен на отдельную проверку;
- `4Tap Settings Console`: установленные/доступные приложения, default-привязки, обучение написанию знаков, UserGestures и пользовательская привязка команды к приложению/действию;
- Settings Console должен поддерживать отдельный приватный профиль `Founder 40`; сами 40 сокращений не публикуются в публичной карте;
- `Default Integration Catalog — Russia`: сначала проверенный app launch, затем документированные deep links/actions;
- российский launch: RuStore как основной канал, другие Android-магазины и Google Play как дополнительные;
- monetization baseline: Free + Pro, subscription только за продолжающийся сервис, B2B/OEM отдельно, без рекламы внутри основного KnockUI-flow;
- продвижение — demo-first: короткая реальная цепочка «текущий контекст → 4Tap → два знака → действие».

Эти направления зафиксированы отдельными связанными ячейками карты и входят в roadmap, а не считаются пост-MVP неопределённостями.

## Current public-map alignment

Публичная карта синхронизирована с текущим рабочим планом `4tap-app`:

- ближайший Android milestone вынесен отдельной ячейкой `First Live Command — SC`: другая программа → stock activation → KnockUI overlay → S → C → SC → запуск назначенного приложения;
- Android activation описан как `stock OS first`; OEM/SystemUI reserved zone сохранена только как deferred branch;
- Local Canvas отвязан от обязательного «последнего тапа» и привязан к общему `ActivationRequest`;
- Design Canon, 4Tap Graffiti Profile, Settings Console, Founder 40 privacy rule и Russia Integration Catalog встроены в связный roadmap;
- Android distribution больше не описывается как Google-Play-only: RuStore зафиксирован как primary Russia channel, Google Play и другие магазины — дополнительные;
- monetization и promotion выделены как отдельные продуктовые узлы;
- cross-platform этап больше не описывается как iOS-keyboard-only.

## iOS implementation options

iOS больше не описывается как keyboard-only архитектура. Зафиксированы варианты реализации, окончательный выбор отложен.

Entry candidates:
- `Custom Keyboard Extension` — ввод внутри text-entry контекста;
- `Back Tap` — системный Double Tap/Triple Tap по задней панели с запуском Shortcut;
- `Action Button` — запуск Shortcut/Control на поддерживаемых моделях;
- `Control Center / Lock Screen Control` — WidgetKit Control.

Общий системный мост:
- `App Intents / Shortcuts Bridge` — связывает перечисленные системные triggers с действиями KnockUI.

Важно:
- эти механизмы не создают произвольный overlay поверх чужого iOS-приложения;
- часть App Intents может выполнять действие без отдельного UI, но это проверяется предметно для каждой команды;
- открытие приложения через intent/shortcut переводит пользователя в KnockUI app;
- конкретная комбинация entry/action paths пока не утверждена.

Добавлены ячейки `ios-back-tap`, `ios-action-button`, `ios-system-controls`, `ios-app-intents-shortcuts`. Ячейка `ios-activation` преобразована в общий узел вариантов.
