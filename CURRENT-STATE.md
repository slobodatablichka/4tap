# CURRENT STATE

Дата: 2026-09-29

## Текущая версия

Интерактивная документация v0.4.

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

Текущее состояние после аудита:
- 50 ячеек;
- 79 связей;
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
3. Следующий Android-риск — сама SystemUI/input-policy reserved Quad Tap zone, которая должна формировать уже подтверждённый `ActivationRequest`.
4. Отдельно продолжать iOS action model и другие платформенные адаптации.


## Полнота технических выводов

Все выводы технической проверки разнесены по интерактивным ячейкам, а не оставлены только в TECH-VERIFICATION-2026-09-28.md.

Дополнительно введены архитектурные узлы:
- `platform-adaptation-model` — общий протокол при разных platform entry/action models;
- `android-activation-redesign` — обязательное решение по замене пассивного глобального trigger;
- `ios-action-redesign` — обязательное решение по iOS execution model.

В `verification` соответствующих ячеек теперь фиксируются не только summary/sources/next_step, но и `implication` — архитектурное следствие. Для WeChat также фиксируется `source_note` о необходимости финальной перепроверки по актуальной официальной документации/DevTools.


## Android activation decision — OEM reserved zone

Принято новое направление:
- сценарий Quad Tap в произвольной области экрана временно снят;
- Quad Tap как фирменный жест сохраняется;
- основной Android-путь: Android/OEM/SystemUI предоставляет специальную system-owned touch-зону;
- четыре тапа распознаются только внутри этой зоны;
- после успешного Quad Tap запускается Local Canvas и далее обычный KnockUI flow;
- `Activation Zone Validation` исключён из основного flow и оставлен только как deferred-ветвь старого arbitrary-area сценария.

Добавлена ячейка `android-oem-quad-zone`.

Важное техническое уточнение: обычного `systemGestures` inset недостаточно, потому что Android документирует доставку простых taps приложению в gesture insets. Нужен реальный system-owned touch target либо OEM/SystemUI/input-policy integration.


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

Тем самым практически подтверждена граница «внешняя система → 4Tap». Это всё ещё не является реализацией системной reserved touch-zone или Quad Tap в SystemUI/input policy. Именно эта зона теперь остаётся основным незакрытым Android activation-контуром.


## Android SystemUI Quad Tap zone design

Утверждена минимальная спецификация первого настоящего системного prototype:
- две system-owned зоны в нижних углах;
- baseline: `58 × 44 dp`;
- UX comparison: `52×40`, `58×44`, `64×48`;
- touch sequence внутри зоны полностью принадлежит SystemUI;
- 1/2/3 незавершённых taps по timeout сбрасываются и не replay-ятся нижележащему приложению;
- первый prototype сохраняет уже проверенные параметры Quad Tap: 4 taps, 45–700 ms inter-tap, 280 ms max tap duration, 20 dp movement;
- LEFT/RIGHT независимы;
- first pass: portrait only.

Среда первого системного prototype выбрана: AOSP `android-latest-release` + Cuttlefish x86_64 userdebug на отдельном Linux host. Downstream после `ActivationRequest` остаётся неизменным и уже подтверждён.

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
